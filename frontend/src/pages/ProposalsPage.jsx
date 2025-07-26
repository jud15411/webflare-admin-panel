// pages/ProposalsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ProposalFormModal from '../components/ProposalFormModal';
import ConfirmModal from '../components/ConfirmModal';
import api from '../api/axios';

const ProposalsPage = () => {
    const [proposals, setProposals] = useState([]);
    const [isFormOpen, setFormOpen] = useState(false);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [editingProposal, setEditingProposal] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const { user } = useContext(AuthContext);

    const fetchProposals = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await api.get('/api/proposals', config);
            setProposals(data);
        } catch (error) { console.error('Failed to fetch proposals', error); }
    };

    useEffect(() => { if (user) fetchProposals(); }, [user]);

    const handleSave = async (formData) => {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        try {
            if (editingProposal) {
                await api.put(`/api/proposals/${editingProposal._id}`, formData, config);
            } else {
                await api.post('/api/proposals', formData, config);
            }
            fetchProposals();
            setFormOpen(false);
            setEditingProposal(null);
        } catch (error) { alert('Failed to save proposal.'); }
    };

    const handleDeleteRequest = (id) => {
        setDeletingId(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        try {
            await api.delete(`/api/proposals/${deletingId}`, config);
            fetchProposals();
        } catch (error) { alert('Failed to delete proposal.'); }
        finally { setConfirmOpen(false); setDeletingId(null); }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Proposals & Quotes</h1>
                <button className="btn btn-primary" onClick={() => { setEditingProposal(null); setFormOpen(true); }}>Create New Proposal</button>
            </div>
            <div className="table-container">
                <table className="pro-table">
                    <thead>
                        <tr>
                            <th>Number</th><th>Client</th><th>Amount</th><th>Status</th><th>Valid Until</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proposals.map((proposal) => (
                            <tr key={proposal._id}>
                                <td>{proposal.proposalNumber}</td>
                                <td>{proposal.client?.name || 'N/A'}</td>
                                <td>${proposal.totalAmount.toLocaleString()}</td>
                                <td><span className={`status status-${proposal.status.toLowerCase()}`}>{proposal.status}</span></td>
                                <td>{new Date(proposal.validUntil).toLocaleDateString()}</td>
                                <td>
                                    <button className="btn btn-secondary btn-sm" onClick={() => { setEditingProposal(proposal); setFormOpen(true); }}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRequest(proposal._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ProposalFormModal isOpen={isFormOpen} onClose={() => setFormOpen(false)} onSave={handleSave} proposalData={editingProposal} userToken={user?.token} />
            <ConfirmModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} title="Delete Proposal" message="Are you sure you want to permanently delete this proposal?" />
        </div>
    );
};

export default ProposalsPage;