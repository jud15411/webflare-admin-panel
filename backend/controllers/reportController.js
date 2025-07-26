import Invoice from '../models/Invoice.js';
import Project from '../models/Project.js';
import Client from '../models/Client.js';

// @desc    Get a summary report of business metrics
// @route   GET /api/reports/summary
export const getSummaryReport = async (req, res) => {
    try {
        // --- Financial Metrics ---
        const financialStats = await Invoice.aggregate([
            {
                $group: {
                    _id: '$status',
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        const totalRevenue = financialStats.find(s => s._id === 'Paid')?.totalAmount || 0;
        const outstandingRevenue = financialStats.find(s => s._id === 'Sent')?.totalAmount || 0;
        
        // --- Project Metrics ---
        const activeProjects = await Project.countDocuments({ status: 'In Progress' });
        const completedProjects = await Project.countDocuments({ status: 'Completed' });

        // --- Client Metrics ---
        const activeClients = await Client.countDocuments({ status: 'Active' });
        const newLeads = await Client.countDocuments({ status: 'Lead' });

        res.json({
            totalRevenue,
            outstandingRevenue,
            activeProjects,
            completedProjects,
            activeClients,
            newLeads,
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// --- NEW DETAIL CONTROLLERS ---

// A helper function to fetch and format data for detailed views
const fetchAndFormat = async (model, filter, fields, populate) => {
    let query = model.find(filter).select(fields.join(' ') + ' -_id').lean(); // Exclude _id from main selection
    
    if (populate) {
        query = query.populate({
            path: populate.path,
            select: populate.select + ' -_id' // Exclude _id from populated doc
        });
    }
    
    const results = await query;
    
    // Format the data for a clean frontend table
    return results.map(doc => {
        const formattedDoc = {};
        fields.forEach(field => {
            const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
            if (populate && field === populate.path) {
                formattedDoc[fieldName] = doc[field] ? doc[field][populate.select] : 'N/A';
            } else if (doc[field] instanceof Date) {
                formattedDoc[fieldName] = doc[field].toLocaleDateString();
            } else if (typeof doc[field] === 'number') {
                formattedDoc[fieldName] = `$${doc[field].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
             else {
                 formattedDoc[fieldName] = doc[field];
            }
        });
        return formattedDoc;
    });
};

export const getPaidInvoicesDetail = async (req, res) => {
    const data = await fetchAndFormat(Invoice, { status: 'Paid' }, ['invoiceNumber', 'client', 'amount', 'dueDate'], { path: 'client', select: 'name' });
    res.json(data);
};

export const getSentInvoicesDetail = async (req, res) => {
    const data = await fetchAndFormat(Invoice, { status: 'Sent' }, ['invoiceNumber', 'client', 'amount', 'dueDate'], { path: 'client', select: 'name' });
    res.json(data);
};

export const getActiveProjectsDetail = async (req, res) => {
    const data = await fetchAndFormat(Project, { status: 'In Progress' }, ['name', 'client', 'status'], { path: 'client', select: 'name' });
    res.json(data);
};

export const getCompletedProjectsDetail = async (req, res) => {
    const data = await fetchAndFormat(Project, { status: 'Completed' }, ['name', 'client', 'status'], { path: 'client', select: 'name' });
    res.json(data);
};

export const getActiveClientsDetail = async (req, res) => {
    const data = await fetchAndFormat(Client, { status: 'Active' }, ['name', 'contactPerson', 'email']);
    res.json(data);
};

export const getNewLeadsDetail = async (req, res) => {
    const data = await fetchAndFormat(Client, { status: 'Lead' }, ['name', 'contactPerson', 'email']);
    res.json(data);
};