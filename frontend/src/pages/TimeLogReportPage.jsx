import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import './ReportsPage.css'; // Reuse the stat card styles

const TimeLogReportPage = () => {
    const [logs, setLogs] = useState([]);
    const [totalHours, setTotalHours] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { user } = useContext(AuthContext);

    const fetchReport = async () => {
        if (!startDate || !endDate) {
            alert('Please select a start and end date.');
            return;
        }
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
                params: { startDate, endDate }, // Pass dates as query params
            };
            const { data } = await axios.get('/api/timelogs', config);
            setLogs(data);
        } catch (error) {
            console.error("Failed to fetch time log report", error);
        }
    };

    // Calculate total hours whenever the logs change
    useEffect(() => {
        const total = logs.reduce((sum, log) => sum + log.hours, 0);
        setTotalHours(total);
    }, [logs]);

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Time Log Report</h1>
            </div>

            {/* Filter Section */}
            <div className="settings-card" style={{ marginBottom: '30px' }}>
                <h3>Filter by Date</h3>
                <div className="date-filter-controls">
                    <div className="form-group">
                        <label>Start Date</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>End Date</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <button onClick={fetchReport} className="btn btn-primary">Run Report</button>
                </div>
            </div>

            {/* Summary Section */}
            <div className="stat-cards-grid" style={{ marginBottom: '30px' }}>
                 <div className="stat-card">
                    <div className="stat-card-info">
                        <span className="stat-card-title">Total Hours for Period</span>
                        <span className="stat-card-value">{totalHours.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Results Table */}
            <div className="table-container">
                <table className="pro-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Team Member</th>
                            <th>Project</th>
                            <th>Hours</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log._id}>
                                <td>{new Date(log.date).toLocaleDateString()}</td>
                                <td>{log.user?.name || 'N/A'}</td>
                                <td>{log.project?.name || 'N/A'}</td>
                                <td>{log.hours.toFixed(2)}</td>
                                <td>{log.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TimeLogReportPage;