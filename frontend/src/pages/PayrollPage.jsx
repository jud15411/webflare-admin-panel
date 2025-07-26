// pages/PayrollPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Papa from 'papaparse'; // <-- Import the new library
import './ReportsPage.css';
import './PayrollPage.css';
import api from '../api/axios';

const StatCard = ({ title, value, icon }) => (
    <div className="stat-card">
        <div className="stat-card-icon">{icon}</div>
        <div className="stat-card-info">
            <span className="stat-card-title">{title}</span>
            <span className="stat-card-value">{value}</span>
        </div>
    </div>
);

const PayrollPage = () => {
    const [reportData, setReportData] = useState([]);
    const [summary, setSummary] = useState({ totalPayout: 0, totalHours: 0, teamMembers: 0 });
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);

    const handleGenerateReport = async () => {
        if (!startDate || !endDate) {
            alert('Please select a start and end date.');
            return;
        }
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
                params: { startDate, endDate },
            };
            const { data } = await api.get('/api/payroll', config);
            setReportData(data);
        } catch (error) {
            console.error("Failed to generate payroll report", error);
            alert('Could not generate report.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const totalPayout = reportData.reduce((sum, item) => sum + item.totalPay, 0);
        const totalHours = reportData.reduce((sum, item) => sum + item.totalHours, 0);
        const teamMembers = reportData.length;
        setSummary({ totalPayout, totalHours, teamMembers });
    }, [reportData]);
    
    // --- NEW: Function to handle CSV export ---
    const handleExport = () => {
        if (reportData.length === 0) {
            alert("There is no data to export.");
            return;
        }

        // Prepare the data for CSV conversion
        const csvData = reportData.map(item => ({
            "Team Member": item.name,
            "Total Hours": item.totalHours.toFixed(2),
            "Hourly Rate": item.hourlyRate.toFixed(2),
            "Total Pay": item.totalPay.toFixed(2)
        }));

        // Convert data to CSV string
        const csv = Papa.unparse(csvData);

        // Create a blob and trigger a download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `payroll_report_${startDate}_to_${endDate}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Payroll Report</h1>
            </div>
            <div className="settings-card" style={{ marginBottom: '30px' }}>
                <h3>Select Pay Period</h3>
                <div className="date-filter-controls">
                    <div className="form-group">
                        <label>Start Date</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>End Date</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <button onClick={handleGenerateReport} className="btn btn-primary" disabled={loading}>
                        {loading ? 'Generating...' : 'Generate Payroll'}
                    </button>
                </div>
            </div>
             <div className="stat-cards-grid" style={{ marginBottom: '30px' }}>
                <StatCard title="Total Payout" value={`$${summary.totalPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon="💰" />
                <StatCard title="Total Hours Logged" value={summary.totalHours.toFixed(2)} icon="⏱️" />
                <StatCard title="Team Members" value={summary.teamMembers} icon="👥" />
            </div>
            <div className="table-container">
                 <div className="table-header">
                    <h3>Payroll Details</h3>
                    {/* Attach the new handleExport function to the button */}
                    <button className="btn btn-secondary btn-sm" onClick={handleExport}>Export to CSV</button>
                </div>
                {loading ? (
                    <div className="loading-state">Loading report data...</div>
                ) : reportData.length > 0 ? (
                    <table className="pro-table">
                        <thead>
                            <tr>
                                <th>Team Member</th>
                                <th>Total Hours</th>
                                <th>Hourly Rate</th>
                                <th>Total Pay</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((item) => (
                                <tr key={item.userId}>
                                    <td>{item.name}</td>
                                    <td>{item.totalHours.toFixed(2)}</td>
                                    <td>${item.hourlyRate.toFixed(2)}</td>
                                    <td><strong>${item.totalPay.toFixed(2)}</strong></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        <p>No payroll data found for the selected period. Please select a date range and click "Generate Payroll".</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayrollPage;