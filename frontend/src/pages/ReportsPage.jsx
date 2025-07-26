import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import './ReportsPage.css';
import api from '../api/axios';
import DetailedReportModal from '../components/DetailedReportModal'; // <-- Import the new modal

// --- Reusable StatCard Component ---
// Now accepts an `onClick` handler to make it interactive
const StatCard = ({ title, value, icon, onClick }) => (
    <button className="stat-card" onClick={onClick}>
        <div className="stat-card-icon">{icon}</div>
        <div className="stat-card-info">
            <span className="stat-card-title">{title}</span>
            <span className="stat-card-value">{value}</span>
        </div>
    </button>
);

const ReportsPage = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [detailedView, setDetailedView] = useState(null); // <-- State to manage the modal
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await api.get('/api/reports/summary', config);
                setReport(data);
            } catch (error) {
                console.error("Failed to fetch report", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchReport();
    }, [user]);

    if (loading) {
        return <div className="page-container">Loading Reports...</div>;
    }

    // A helper function to format currency
    const formatCurrency = (amount) => `$${(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Business Reports</h1>
            </div>
            {report && (
                <div className="stat-cards-grid">
                    <StatCard title="Total Revenue" value={formatCurrency(report.totalRevenue)} icon="💰" onClick={() => setDetailedView('Total Revenue')} />
                    <StatCard title="Outstanding Revenue" value={formatCurrency(report.outstandingRevenue)} icon="✉️" onClick={() => setDetailedView('Outstanding Revenue')} />
                    <StatCard title="Active Projects" value={report.activeProjects} icon="⚙️" onClick={() => setDetailedView('Active Projects')} />
                    <StatCard title="Active Clients" value={report.activeClients} icon="👥" onClick={() => setDetailedView('Active Clients')} />
                    <StatCard title="New Leads" value={report.newLeads} icon="📈" onClick={() => setDetailedView('New Leads')} />
                    <StatCard title="Projects Completed" value={report.completedProjects} icon="✅" onClick={() => setDetailedView('Projects Completed')} />
                </div>
            )}

            {/* Conditionally render the modal */}
            {detailedView && (
                <DetailedReportModal
                    reportType={detailedView}
                    onClose={() => setDetailedView(null)}
                    userToken={user.token}
                />
            )}
        </div>
    );
};

export default ReportsPage;