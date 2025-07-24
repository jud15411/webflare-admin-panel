import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClientFormModal.css';

const TaskFormModal = ({ isOpen, onClose, onSave, taskData, user, parentTask }) => {
    const [formData, setFormData] = useState({ project: '', title: '', description: '', assignedTo: '' });
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);

    // Fetch projects and users for dropdowns
    useEffect(() => {
        const fetchData = async () => {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [projRes, userRes] = await Promise.all([
                axios.get('/api/projects', config),
                axios.get('/api/users', config)
            ]);
            setProjects(projRes.data);
            setUsers(userRes.data);
        };
        if (isOpen) fetchData();
    }, [isOpen, user.token]);
    
    // Populate form for editing or creating a sub-task
    useEffect(() => {
        if (taskData) { // Editing existing task
            setFormData({ ...taskData, project: taskData.project._id, assignedTo: taskData.assignedTo._id });
        } else if (parentTask) { // Creating sub-task
            setFormData({ project: parentTask.project._id, title: '', description: '', assignedTo: parentTask.assignedTo._id, parentTask: parentTask._id });
        } else { // Creating new task
            setFormData({ project: '', title: '', description: '', assignedTo: '' });
        }
    }, [taskData, parentTask, isOpen]);


    if (!isOpen) return null;
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData, taskData?._id); };
    
    // Determine if fields should be disabled based on role and context
    const isDeveloper = user.role === 'developer';
    const isCreatingSubtask = isDeveloper && parentTask;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{taskData ? 'Edit Task' : 'Add New Task'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Project</label>
                        <select name="project" value={formData.project} onChange={handleChange} required disabled={isCreatingSubtask}>
                            <option value="">Select a project</option>
                            {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                    </div>
                     <div className="form-group">
                        <label>Assigned To</label>
                        <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} required disabled={isCreatingSubtask}>
                            <option value="">Assign to a team member</option>
                            {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
                        </select>
                    </div>
                    <div className="form-group"><label>Task Title</label><input type="text" name="title" value={formData.title} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows="4"></textarea></div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskFormModal;