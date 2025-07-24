import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import './ReportsPage.css'; // We'll create this file next

// A reusable component for our stat cards
const StatCard = ({ title, value, icon }) => (
    <div className="stat-card">
        <div className="stat-card-icon">{icon}</div>
        <div className="stat-card-info">
            <span className="stat-card-title">{title}</span>
            <span className="stat-card-value">{value}</span>
        </div>
    </div>
);

const ReportsPage = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/reports/summary', config);
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

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Business Reports</h1>
            </div>

            {report && (
                <div className="stat-cards-grid">
                    <StatCard title="Total Revenue" value={`$${report.totalRevenue.toLocaleString()}`} icon="💰" />
                    <StatCard title="Outstanding Revenue" value={`$${report.outstandingRevenue.toLocaleString()}`} icon="✉️" />
                    <StatCard title="Active Projects" value={report.activeProjects} icon="⚙️" />
                    <StatCard title="Active Clients" value={report.activeClients} icon="👥" />
                    <StatCard title="New Leads" value={report.newLeads} icon="📈" />
                    <StatCard title="Projects Completed" value={report.completedProjects} icon="✅" />
                </div>
            )}
        </div>
    );
};

export default ReportsPage;