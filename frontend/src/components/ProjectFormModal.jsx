import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClientFormModal.css';

const ProjectFormModal = ({ isOpen, onClose, onSave, projectData, userToken }) => {
  const [formData, setFormData] = useState({ name: '', client: '', description: '', status: 'Not Started' });
  const [clients, setClients] = useState([]); // <-- State to hold the list of clients

  // --- NEW: useEffect to fetch clients when the modal opens ---
  useEffect(() => {
    const fetchClients = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${userToken}` } };
            const { data } = await axios.get('/api/clients', config);
            setClients(data);
        } catch (error) {
            console.error("Failed to fetch clients", error);
        }
    };

    if (isOpen) {
        fetchClients();
    }
  }, [isOpen, userToken]);

  useEffect(() => {
    if (projectData) {
      // If editing, make sure the client ID is correctly set
      setFormData({...projectData, client: projectData.client?._id || '' });
    } else {
      setFormData({ name: '', client: '', description: '', status: 'Not Started' });
    }
  }, [projectData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{projectData ? 'Edit Project' : 'Add New Project'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Client</label>
            {/* --- THIS IS THE UPDATED DROPDOWN --- */}
            <select name="client" value={formData.client} onChange={handleChange} required>
                <option value="" disabled>Select a client</option>
                {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                        {client.name}
                    </option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4"></textarea>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Project</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;