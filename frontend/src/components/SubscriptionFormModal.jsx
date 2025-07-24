import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClientFormModal.css';

const SubscriptionFormModal = ({ isOpen, onClose, onSave, subscriptionData, userToken }) => {
    const [formData, setFormData] = useState({ client: '', planName: '', amount: 0, billingCycle: 'Monthly', status: 'Active', nextPaymentDate: '' });
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            const config = { headers: { Authorization: `Bearer ${userToken}` } };
            const { data } = await axios.get('/api/clients', config);
            setClients(data);
        };
        if (isOpen) fetchClients();
    }, [isOpen, userToken]);

    useEffect(() => {
        if (subscriptionData) {
            setFormData({ ...subscriptionData, nextPaymentDate: new Date(subscriptionData.nextPaymentDate).toISOString().split('T')[0] });
        } else {
            setFormData({ client: '', planName: '', amount: 0, billingCycle: 'Monthly', status: 'Active', nextPaymentDate: '' });
        }
    }, [subscriptionData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{subscriptionData ? 'Edit Subscription' : 'Add New Subscription'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><label>Client</label><select name="client" value={formData.client} onChange={handleChange} required><option value="">Select a client</option>{clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
                    <div className="form-group"><label>Plan Name</label><input type="text" name="planName" value={formData.planName} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Amount ($)</label><input type="number" name="amount" step="0.01" min="0" value={formData.amount} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Billing Cycle</label><select name="billingCycle" value={formData.billingCycle} onChange={handleChange}><option>Monthly</option><option>Yearly</option></select></div>
                    <div className="form-group"><label>Status</label><select name="status" value={formData.status} onChange={handleChange}><option>Active</option><option>Paused</option><option>Canceled</option></select></div>
                    <div className="form-group"><label>Next Payment Date</label><input type="date" name="nextPaymentDate" value={formData.nextPaymentDate} onChange={handleChange} /></div>
                    <div className="form-actions"><button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button><button type="submit" className="btn btn-primary">Save Subscription</button></div>
                </form>
            </div>
        </div>
    );
};

export default SubscriptionFormModal;