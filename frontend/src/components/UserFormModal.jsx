import React, { useState, useEffect } from 'react';
import './ClientFormModal.css'; // Reuse the same professional modal styles

const UserFormModal = ({ isOpen, onClose, onSave, userData, existingRoles }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'developer',
    hourlyRate: 0,
  });

  const isEditing = Boolean(userData);

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: userData.name,
        email: userData.email,
        password: '', // Don't show existing password
        role: userData.role,
        hourlyRate: userData.hourlyRate || 0,
      });
    } else {
      // Reset for new user
      setFormData({ name: '', email: '', password: '', role: 'developer', hourlyRate: 0 });
    }
  }, [userData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, userData?._id);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? 'Edit Team Member' : 'Add New Team Member'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          {!isEditing && ( // Only show password field for new users
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
          )}
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="developer">Developer</option>
              <option value="sales">Sales</option>
              {/* Disable CTO/CEO options if they already exist, unless we're editing that user */}
              <option value="cto" disabled={existingRoles.cto && existingRoles.cto !== userData?._id}>CTO</option>
              <option value="ceo" disabled={existingRoles.ceo && existingRoles.ceo !== userData?._id}>CEO</option>
            </select>
          </div>
          <div className="form-group">
            <label>Hourly Rate ($)</label>
            <input type="number" name="hourlyRate" step="0.01" min="0" value={formData.hourlyRate} onChange={handleChange} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;