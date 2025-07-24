import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import PayoutRequestModal from '../components/PayoutRequestModal';
import ConfirmModal from '../components/ConfirmModal';

const PayoutsPage = () => {
    const [payouts, setPayouts] = useState([]);
    const [isRequestModalOpen, setRequestModalOpen] = useState(false);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [payoutToApprove, setPayoutToApprove] = useState(null);
    const { user } = useContext(AuthContext);

    const fetchPayouts = async () => {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/payouts', config);
        setPayouts(data);
    };

    useEffect(() => { if (user) fetchPayouts(); }, [user]);

    const handleRequestSave = async (formData) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/payouts', formData, config);
            fetchPayouts();
            setRequestModalOpen(false);
        } catch (error) { alert('Failed to request payout.'); }
    };

    const handleApproveRequest = (payout) => {
        setPayoutToApprove(payout);
        setConfirmModalOpen(true);
    };

    const handleConfirmApproval = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`/api/payouts/${payoutToApprove._id}/approve`, {}, config);
            fetchPayouts();
        } catch (error) {
            alert('Approval failed. See console for details.');
            console.error(error);
        } finally {
            setConfirmModalOpen(false);
            setPayoutToApprove(null);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Bank Payouts</h1>
                <button className="btn btn-primary" onClick={() => setRequestModalOpen(true)}>Request Payout</button>
            </div>
            <div className="table-container">
                <table className="pro-table">
                    <thead><tr><th>Date</th><th>Requested By</th><th>Amount</th><th>Status</th><th>Approved By</th><th>Actions</th></tr></thead>
                    <tbody>
                        {payouts.map((payout) => (
                            <tr key={payout._id}>
                                <td>{new Date(payout.createdAt).toLocaleString()}</td>
                                <td>{payout.requestedBy.name}</td>
                                <td>${payout.amount.toFixed(2)}</td>
                                <td><span className={`status status-${payout.status.toLowerCase().replace(' ', '-')}`}>{payout.status}</span></td>
                                <td>{payout.approvedBy?.name || 'N/A'}</td>
                                <td>
                                    {user.role === 'ceo' && payout.status === 'Pending Approval' && (
                                        <button onClick={() => handleApproveRequest(payout)} className="btn btn-primary btn-sm">Approve</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <PayoutRequestModal isOpen={isRequestModalOpen} onClose={() => setRequestModalOpen(false)} onSave={handleRequestSave} />
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirmApproval}
                title="Approve Payout"
                message={`Are you sure you want to approve this payout of $${payoutToApprove?.amount.toFixed(2)} and transfer funds from Stripe to your bank account?`}
            />
        </div>
    );
};

export default PayoutsPage;