import Invoice from '../models/Invoice.js';
import Project from '../models/Project.js';
import Client from '../models/Client.js';

// @desc    Get a comprehensive data summary for the CEO dashboard
// @route   GET /api/dashboard/ceo
export const getCeoDashboardSummary = async (req, res) => {
    try {
        // --- Financial KPIs ---
        // Safely find and calculate totals. If a collection is empty, it will result in 0.
        const paidInvoices = await Invoice.find({ status: 'Paid' });
        const sentInvoices = await Invoice.find({ status: 'Sent' });

        const totalRevenue = paidInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
        const outstandingRevenue = sentInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);

        // --- Project KPIs ---
        const activeProjects = await Project.countDocuments({ status: 'In Progress' });

        // --- Recent Activity ---
        // These queries are safe and will return an empty array if nothing is found.
        const recentProjects = await Project.find().sort({ createdAt: -1 }).limit(5).populate('client', 'name');
        const recentClients = await Client.find().sort({ createdAt: -1 }).limit(5);

        // This mapping uses optional chaining (?.) to prevent errors if a project's client has been deleted.
        const activityFeed = [
            ...recentProjects.map(p => ({ type: 'Project', text: `${p.name} for ${p.client?.name || 'a client'}`, date: p.createdAt })),
            ...recentClients.map(c => ({ type: 'Client', text: `${c.name} was added`, date: c.createdAt })),
        ]
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort all items by date
        .slice(0, 10); // Take the most recent items

        // Send the final, safe data object.
        res.json({
            totalRevenue,
            outstandingRevenue,
            activeProjects,
            activityFeed,
        });

    } catch (error) {
        // If an unexpected error still occurs, this will log it and send a clear message.
        console.error("CRITICAL ERROR in getCeoDashboardSummary:", error);
        res.status(500).json({ message: 'Server failed while generating dashboard summary.', error: error.message });
    }
};