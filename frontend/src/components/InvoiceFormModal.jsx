import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClientFormModal.css'; // Reuse existing modal styles

const InvoiceFormModal = ({ isOpen, onClose, onSave, invoiceData, userToken }) => {
    const [formData, setFormData] = useState({ client: '', dueDate: '', status: 'Draft', items: [{ description: '', amount: 0 }] });
    const [clients, setClients] = useState([]);

    // Effect to fetch the list of clients for the dropdown
    useEffect(() => {
        const fetchClients = async () => {
            const config = { headers: { Authorization: `Bearer ${userToken}` } };
            try {
                const { data } = await axios.get('/api/clients', config);
                setClients(data);
            } catch (error) {
                console.error("Failed to fetch clients for invoice form", error);
            }
        };
        if (isOpen) {
            fetchClients();
        }
    }, [isOpen, userToken]);

    // Effect to populate the form when editing an existing invoice
    useEffect(() => {
        if (invoiceData) {
            setFormData({
                ...invoiceData,
                client: invoiceData.client?._id || '',
                dueDate: new Date(invoiceData.dueDate).toISOString().split('T')[0]
            });
        } else {
            // Reset the form when creating a new invoice
            setFormData({ client: '', dueDate: '', status: 'Draft', items: [{ description: '', amount: 0 }] });
        }
    }, [invoiceData, isOpen]);

    if (!isOpen) return null;

    // --- FORM HANDLERS ---

    const handleMainChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleItemChange = (index, e) => {
        const updatedItems = [...formData.items];
        updatedItems[index][e.target.name] = e.target.value;
        setFormData({ ...formData, items: updatedItems });
    };

    const addItem = () => setFormData({ ...formData, items: [...formData.items, { description: '', amount: 0 }] });
    const removeItem = (index) => setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
    
    // Automatically calculate the total amount from line items
    const totalAmount = formData.items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, amount: totalAmount }); // Send 'amount' to match the backend model
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
                <h2>{invoiceData ? 'Edit Invoice' : 'Create New Invoice'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Client</label>
                        <select name="client" value={formData.client} onChange={handleMainChange} required>
                            <option value="" disabled>Select a client</option>
                            {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Due Date</label>
                        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleMainChange} required />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select name="status" value={formData.status} onChange={handleMainChange}>
                            <option value="Draft">Draft</option>
                            <option value="Sent">Sent</option>
                            <option value="Paid">Paid</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>
                    
                    <h3>Line Items</h3>
                    {formData.items.map((item, index) => (
                        <div key={index} className="line-item">
                            <input type="text" name="description" placeholder="Description" value={item.description} onChange={(e) => handleItemChange(index, e)} required />
                            <input type="number" name="amount" placeholder="Amount" value={item.amount} onChange={(e) => handleItemChange(index, e)} required />
                            <button type="button" onClick={() => removeItem(index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={addItem} className="btn btn-secondary btn-sm">Add Item</button>

                    <div className="proposal-total">Total: ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Invoice</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InvoiceFormModal;