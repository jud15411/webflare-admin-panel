import React, { useState, useEffect } from 'react';
import './ClientFormModal.css'; // We will create this CSS file next

const ClientFormModal = ({ isOpen, onClose, onSave, clientData }) => {
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    status: 'Lead',
  });

  // When clientData is passed (for editing), populate the form
  useEffect(() => {
    if (clientData) {
      setFormData(clientData);
    } else {
      // Reset form when opening for a new client
      setFormData({ name: '', contactPerson: '', email: '', phone: '', status: 'Lead' });
    }
  }, [clientData, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{clientData ? 'Edit Client' : 'Add New Client'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Contact Person</label>
            <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Lead">Lead</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Client</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientFormModal;