// pages/TimeTrackingPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import './SettingsPage.css';
import api from '../api/axios';
import ConfirmModal from '../components/ConfirmModal'; // <-- Import the modal

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

    // --- NEW: State for the confirmation modal ---
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const fetchPageData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            
            const { data: projectData } = await api.get('/api/projects', config);
            setProjects(projectData);

            const logsEndpoint = user.role === 'ceo' ? '/api/timelogs' : '/api/timelogs/mylogs';
            const { data: logData } = await api.get(logsEndpoint, config);
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
            await api.post('/api/timelogs', formData, config);
            alert('Time logged successfully!');
            fetchPageData();
            setFormData({ ...formData, hours: '', description: '' });
        } catch (error) {
            alert('Failed to log time.');
            console.error(error);
        }
    };
    
    // --- NEW: Functions to handle deletion ---
    const handleDeleteRequest = (id) => {
        setDeletingId(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await api.delete(`/api/timelogs/${deletingId}`, config);
            fetchPageData(); // Refresh the logs
        } catch (error) {
            alert('Failed to delete time log.');
            console.error(error);
        } finally {
            setConfirmOpen(false);
            setDeletingId(null);
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
                    {/* ... form content is the same ... */}
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
                             {user.role === 'ceo' && <th>Team Member</th>}
                             <th>Project</th>
                             <th>Hours</th>
                             <th>Description</th>
                             {user.role === 'ceo' && <th>Actions</th>} {/* <-- Add Actions header for CEO */}
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
                                 {/* --- Add Delete button for CEO --- */}
                                 {user.role === 'ceo' && (
                                     <td>
                                         <button onClick={() => handleDeleteRequest(log._id)} className="btn btn-danger btn-sm">
                                             Delete
                                         </button>
                                     </td>
                                 )}
                             </tr>
                         ))}
                     </tbody>
                 </table>
            </div>

            {/* --- Add the confirmation modal to the page --- */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Time Log"
                message="Are you sure you want to permanently delete this time entry?"
            />
        </div>
    );
};

export default TimeTrackingPage;