import React, { useState, useEffect } from 'react';
import './ClientFormModal.css';

const ServiceFormModal = ({ isOpen, onClose, onSave, serviceData }) => {
    const [formData, setFormData] = useState({ name: '', description: '', price: '', features: [], isActive: true });

    useEffect(() => {
        if (serviceData) {
            setFormData({ ...serviceData, features: serviceData.features.join('\n') });
        } else {
            setFormData({ name: '', description: '', price: '', features: '', isActive: true });
        }
    }, [serviceData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleCheckboxChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.checked });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // Convert features from a newline-separated string back to an array
        const finalData = { ...formData, features: formData.features.split('\n').filter(f => f) };
        onSave(finalData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{serviceData ? 'Edit Service' : 'Create New Service'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><label>Service Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Price</label><input type="text" name="price" value={formData.price} onChange={handleChange} placeholder="e.g., $500/mo or Starting at $2,500" required /></div>
                    <div className="form-group"><label>Description</label><textarea name="description" rows="3" value={formData.description} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Features (one per line)</label><textarea name="features" rows="5" value={formData.features} onChange={handleChange} /></div>
                    <div className="form-group checkbox-group"><input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleCheckboxChange} /><label>Active (Visible on public site)</label></div>
                    <div className="form-actions"><button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button><button type="submit" className="btn btn-primary">Save Service</button></div>
                </form>
            </div>
        </div>
    );
};

export default ServiceFormModal;