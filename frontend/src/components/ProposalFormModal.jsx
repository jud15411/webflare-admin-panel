import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClientFormModal.css';

const ProposalFormModal = ({ isOpen, onClose, onSave, proposalData, userToken }) => {
    const [formData, setFormData] = useState({ client: '', title: '', validUntil: '', lineItems: [{ description: '', price: 0 }] });
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
        if (proposalData) {
            setFormData({ ...proposalData, validUntil: new Date(proposalData.validUntil).toISOString().split('T')[0] });
        } else {
            setFormData({ client: '', title: '', validUntil: '', lineItems: [{ description: '', price: 0 }] });
        }
    }, [proposalData, isOpen]);

    if (!isOpen) return null;

    const handleMainChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleItemChange = (index, e) => {
        const updatedItems = [...formData.lineItems];
        updatedItems[index][e.target.name] = e.target.value;
        setFormData({ ...formData, lineItems: updatedItems });
    };
    const addItem = () => setFormData({ ...formData, lineItems: [...formData.lineItems, { description: '', price: 0 }] });
    const removeItem = (index) => setFormData({ ...formData, lineItems: formData.lineItems.filter((_, i) => i !== index) });
    const totalAmount = formData.lineItems.reduce((sum, item) => sum + Number(item.price || 0), 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, totalAmount });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
                <h2>{proposalData ? 'Edit Proposal' : 'Create New Proposal'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><label>Title</label><input type="text" name="title" value={formData.title} onChange={handleMainChange} required /></div>
                    <div className="form-group"><label>Client</label><select name="client" value={formData.client} onChange={handleMainChange} required><option value="">Select a client</option>{clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
                    <div className="form-group"><label>Valid Until</label><input type="date" name="validUntil" value={formData.validUntil} onChange={handleMainChange} required /></div>
                    
                    <h3>Line Items</h3>
                    {formData.lineItems.map((item, index) => (
                        <div key={index} className="line-item">
                            <input type="text" name="description" placeholder="Description" value={item.description} onChange={(e) => handleItemChange(index, e)} required />
                            <input type="number" name="price" placeholder="Price" value={item.price} onChange={(e) => handleItemChange(index, e)} required />
                            <button type="button" onClick={() => removeItem(index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={addItem} className="btn btn-secondary btn-sm">Add Item</button>

                    <div className="proposal-total">Total: ${totalAmount.toLocaleString()}</div>
                    
                    <div className="form-actions"><button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button><button type="submit" className="btn btn-primary">Save Proposal</button></div>
                </form>
            </div>
        </div>
    );
};

export default ProposalFormModal;