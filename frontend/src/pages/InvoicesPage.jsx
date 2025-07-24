import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import InvoiceFormModal from '../components/InvoiceFormModal';
import ConfirmModal from '../components/ConfirmModal';

const InvoicesPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [isFormOpen, setFormOpen] = useState(false);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const { user } = useContext(AuthContext);

    const fetchInvoices = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/invoices', config);
            setInvoices(data);
        } catch (error) { console.error('Failed to fetch invoices', error); }
    };

    useEffect(() => { if (user) fetchInvoices(); }, [user]);

    const handleSave = async (formData) => {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        try {
            if (editingInvoice) {
                await axios.put(`/api/invoices/${editingInvoice._id}`, formData, config);
            } else {
                await axios.post('/api/invoices', formData, config);
            }
            fetchInvoices();
            setFormOpen(false);
            setEditingInvoice(null);
        } catch (error) { alert('Failed to save invoice.'); }
    };

    const handleDeleteRequest = (id) => {
        setDeletingId(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        try {
            await axios.delete(`/api/invoices/${deletingId}`, config);
            fetchInvoices();
        } catch (error) { alert('Failed to delete invoice.'); }
        finally { setConfirmOpen(false); setDeletingId(null); }
    };

    const handleGetPaymentLink = async (invoiceId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post('/api/stripe/create-checkout-session', { invoiceId }, config);
            // Copy link to clipboard and alert user
            navigator.clipboard.writeText(data.url);
            alert(`Payment link copied to clipboard:\n\n${data.url}`);
        } catch (error) {
            alert('Failed to create payment link.');
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Invoices</h1>
                <button className="btn btn-primary" onClick={() => { setEditingInvoice(null); setFormOpen(true); }}>Create New Invoice</button>
            </div>
            <div className="table-container">
                <table className="pro-table">
                    <thead>
                        <tr><th>Number</th><th>Client</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr key={invoice._id}>
                                <td>{invoice.invoiceNumber}</td>
                                <td>{invoice.client?.name || 'N/A'}</td>
                                <td>${invoice.amount.toFixed(2)}</td>
                                <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                <td><span className={`status status-${invoice.status.toLowerCase()}`}>{invoice.status}</span></td>
                                <td>
                                    <button className="btn btn-secondary btn-sm" onClick={() => { setEditingInvoice(invoice); setFormOpen(true); }}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRequest(invoice._id)}>Delete</button>
                                    {invoice.status === 'Sent' && (
                                        <button className="btn btn-primary btn-sm" onClick={() => handleGetPaymentLink(invoice._id)}>Get Link</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <InvoiceFormModal isOpen={isFormOpen} onClose={() => setFormOpen(false)} onSave={handleSave} invoiceData={editingInvoice} userToken={user?.token} />
            <ConfirmModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} title="Delete Invoice" message="Are you sure you want to permanently delete this invoice?" />
        </div>
    );
};

export default InvoicesPage;