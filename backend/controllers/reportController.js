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
        const overdueRevenue = financialStats.find(s => s._id === 'Overdue')?.totalAmount || 0;
        
        // --- Project Metrics ---
        const activeProjects = await Project.countDocuments({ status: 'In Progress' });
        const completedProjects = await Project.countDocuments({ status: 'Completed' });

        // --- Client Metrics ---
        const activeClients = await Client.countDocuments({ status: 'Active' });
        const newLeads = await Client.countDocuments({ status: 'Lead' });

        res.json({
            totalRevenue,
            outstandingRevenue,
            overdueRevenue,
            activeProjects,
            completedProjects,
            activeClients,
            newLeads,
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};