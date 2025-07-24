import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import SubscriptionFormModal from '../components/SubscriptionFormModal';
import ConfirmModal from '../components/ConfirmModal';

const SubscriptionsPage = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [isFormOpen, setFormOpen] = useState(false);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [editingSub, setEditingSub] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const { user } = useContext(AuthContext);

    const fetchSubscriptions = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/subscriptions', config);
            setSubscriptions(data);
        } catch (error) { console.error('Failed to fetch subscriptions', error); }
    };

    useEffect(() => { if (user) fetchSubscriptions(); }, [user]);

    const handleSave = async (formData) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            if (editingSub) {
                await axios.put(`/api/subscriptions/${editingSub._id}`, formData, config);
            } else {
                await axios.post('/api/subscriptions', formData, config);
            }
            fetchSubscriptions();
            setFormOpen(false);
        } catch (error) { alert('Failed to save subscription.'); }
    };

    const handleDeleteRequest = (id) => { setDeletingId(id); setConfirmOpen(true); };
    const handleConfirmDelete = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`/api/subscriptions/${deletingId}`, config);
            fetchSubscriptions();
        } catch (error) { alert('Failed to delete subscription.'); }
        finally { setConfirmOpen(false); setDeletingId(null); }
    };

    return (
        <div className="page-container">
            <div className="page-header"><h1>Recurring Subscriptions</h1><button className="btn btn-primary" onClick={() => { setEditingSub(null); setFormOpen(true); }}>Add New Subscription</button></div>
            <div className="table-container">
                <table className="pro-table">
                    <thead><tr><th>Client</th><th>Plan</th><th>Amount</th><th>Cycle</th><th>Next Payment</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {subscriptions.map((sub) => (
                            <tr key={sub._id}>
                                <td>{sub.client?.name || 'N/A'}</td><td>{sub.planName}</td><td>${sub.amount.toLocaleString()}</td><td>{sub.billingCycle}</td><td>{new Date(sub.nextPaymentDate).toLocaleDateString()}</td><td><span className={`status status-${sub.status.toLowerCase()}`}>{sub.status}</span></td>
                                <td>
                                    <button className="btn btn-secondary btn-sm" onClick={() => { setEditingSub(sub); setFormOpen(true); }}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRequest(sub._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <SubscriptionFormModal isOpen={isFormOpen} onClose={() => setFormOpen(false)} onSave={handleSave} subscriptionData={editingSub} userToken={user?.token} />
            <ConfirmModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} title="Delete Subscription" message="Are you sure you want to permanently delete this subscription?" />
        </div>
    );
};

export default SubscriptionsPage;