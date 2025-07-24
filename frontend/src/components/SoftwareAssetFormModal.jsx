import React, { useState, useEffect } from 'react';
import './ClientFormModal.css';

const SoftwareAssetFormModal = ({ isOpen, onClose, onSave, assetData }) => {
    const [formData, setFormData] = useState({ name: '', cost: 0, purchaseDate: '', renewalDate: '', licenseKey: '' });

    useEffect(() => {
        if (assetData) {
            setFormData({
                ...assetData,
                purchaseDate: new Date(assetData.purchaseDate).toISOString().split('T')[0],
                renewalDate: assetData.renewalDate ? new Date(assetData.renewalDate).toISOString().split('T')[0] : '',
            });
        } else {
            setFormData({ name: '', cost: 0, purchaseDate: '', renewalDate: '', licenseKey: '' });
        }
    }, [assetData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{assetData ? 'Edit Asset' : 'Add New Asset'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><label>Software Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Cost ($)</label><input type="number" name="cost" value={formData.cost} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Purchase Date</label><input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Renewal Date</label><input type="date" name="renewalDate" value={formData.renewalDate} onChange={handleChange} /></div>
                    <div className="form-group"><label>License Key</label><input type="text" name="licenseKey" value={formData.licenseKey} onChange={handleChange} /></div>
                    <div className="form-actions"><button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button><button type="submit" className="btn btn-primary">Save Asset</button></div>
                </form>
            </div>
        </div>
    );
};

export default SoftwareAssetFormModal;