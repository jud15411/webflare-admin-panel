import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import './ReportsPage.css'; // Reuse stat card styles
import './Dashboard.css';    // New dedicated CSS for the dashboard

// --- Reusable StatCard Component ---
const StatCard = ({ title, value, icon }) => (
    <div className="stat-card">
        <div className="stat-card-icon">{icon}</div>
        <div className="stat-card-info">
            <span className="stat-card-title">{title}</span>
            <span className="stat-card-value">{value}</span>
        </div>
    </div>
);

// --- CEO's Dashboard View ---
const CeoDashboard = ({ user }) => {
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/dashboard/ceo', config);
            setSummary(data);
        };
        if (user) fetchSummary();
    }, [user]);

    return (
        <>
            <div className="stat-cards-grid">
                <StatCard title="Total Revenue" value={`$${(summary?.totalRevenue || 0).toLocaleString()}`} icon="💰" />
                <StatCard title="Outstanding Revenue" value={`$${(summary?.outstandingRevenue || 0).toLocaleString()}`} icon="✉️" />
                <StatCard title="Active Projects" value={summary?.activeProjects || 0} icon="⚙️" />
            </div>
            <div className="dashboard-columns">
                <div className="dashboard-column">
                    <h3>Recent Activity</h3>
                    <ul className="activity-feed">
                        {summary?.activityFeed.map((item, index) => (
                            <li key={index}><strong>{item.type}:</strong> {item.text} <span>{new Date(item.date).toLocaleDateString()}</span></li>
                        ))}
                    </ul>
                </div>
                <div className="dashboard-column">
                    <h3>Projects Overview</h3>
                    {/* A great place to add a chart component */}
                    <p>Project status chart would go here.</p>
                </div>
            </div>
        </>
    );
};

// --- Team Member's Dashboard View ---
const TeamDashboard = ({ user }) => {
    const [myTasks, setMyTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/tasks', config); // Fetches tasks assigned to the logged-in user
            setMyTasks(data);
        };
        if (user) fetchTasks();
    }, [user]);

    return (
        <div className="dashboard-columns">
            <div className="dashboard-column">
                <h3>My Open Tasks</h3>
                <ul className="task-list">
                    {myTasks.filter(t => t.status !== 'Done').map(task => (
                        <li key={task._id}>
                            <strong>{task.title}</strong>
                            <span> for {task.project.name}</span>
                            <span className={`status status-${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span>
                        </li>
                    ))}
                </ul>
            </div>
             <div className="dashboard-column">
                <h3>Welcome!</h3>
                <p>This is your personal dashboard. Here you'll find tasks and projects assigned directly to you.</p>
            </div>
        </div>
    );
};

// --- Main Dashboard Component ---
const Dashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Dashboard</h1>
            </div>
            {/* Conditionally render the correct dashboard based on user role */}
            {user?.role === 'ceo' ? <CeoDashboard user={user} /> : <TeamDashboard user={user} />}
        </div>
    );
};

export default Dashboard;