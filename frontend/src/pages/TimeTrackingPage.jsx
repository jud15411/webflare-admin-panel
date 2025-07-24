import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import './SettingsPage.css';

const TimeTrackingPage = () => {
    const [projects, setProjects] = useState([]);
    const [timeLogs, setTimeLogs] = useState([]);
    const [formData, setFormData] = useState({
        project: '',
        hours: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
    });
    const { user } = useContext(AuthContext);

    const fetchPageData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            
            // Fetch projects for the dropdown
            const { data: projectData } = await axios.get('/api/projects', config);
            setProjects(projectData);

            // --- THIS IS THE UPDATED LOGIC ---
            // Determine which endpoint to use based on user role
            const logsEndpoint = user.role === 'ceo' ? '/api/timelogs' : '/api/timelogs/mylogs';
            const { data: logData } = await axios.get(logsEndpoint, config);
            setTimeLogs(logData);

        } catch (error) {
            console.error("Failed to fetch page data", error);
        }
    };

    useEffect(() => {
        if (user?.token) {
            fetchPageData();
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/timelogs', formData, config);
            alert('Time logged successfully!');
            fetchPageData(); // Refresh all page data
            // Reset form
            setFormData({ ...formData, hours: '', description: '' });
        } catch (error) {
            alert('Failed to log time.');
            console.error(error);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Log Your Time</h1>
            </div>

            <div className="settings-card">
                <h3>New Time Entry</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Project</label>
                        <select name="project" value={formData.project} onChange={handleChange} required>
                            <option value="" disabled>Select a project</option>
                            {projects.map(p => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group"><label>Date</label><input type="date" name="date" value={formData.date} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Hours Worked</label><input type="number" name="hours" step="0.1" min="0" value={formData.hours} onChange={handleChange} placeholder="e.g., 4.5" required /></div>
                    <div className="form-group"><label>Work Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="What did you work on?" required></textarea></div>
                    <div className="form-actions"><button type="submit" className="btn btn-primary">Log Time</button></div>
                </form>
            </div>

            <div className="table-container" style={{ marginTop: '30px' }}>
                 <h3>{user.role === 'ceo' ? 'All Recent Logs' : 'My Recent Logs'}</h3>
                 <table className="pro-table">
                     <thead>
                         <tr>
                             <th>Date</th>
                             {/* Conditionally show Team Member column for CEO */}
                             {user.role === 'ceo' && <th>Team Member</th>}
                             <th>Project</th>
                             <th>Hours</th>
                             <th>Description</th>
                         </tr>
                     </thead>
                     <tbody>
                         {timeLogs.map(log => (
                             <tr key={log._id}>
                                 <td>{new Date(log.date).toLocaleDateString()}</td>
                                 {user.role === 'ceo' && <td>{log.user?.name || 'N/A'}</td>}
                                 <td>{log.project?.name || 'N/A'}</td>
                                 <td>{log.hours}</td>
                                 <td>{log.description}</td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
            </div>
        </div>
    );
};

export default TimeTrackingPage;