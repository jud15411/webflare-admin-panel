import React, { useState, useEffect } from 'react';
import './ClientFormModal.css';

const ExpenseFormModal = ({ isOpen, onClose, onSave, expenseData }) => {
    const [formData, setFormData] = useState({ description: '', category: 'Software', amount: 0, date: '' });

    useEffect(() => {
        if (expenseData) {
            setFormData({ ...expenseData, date: new Date(expenseData.date).toISOString().split('T')[0] });
        } else {
            setFormData({ description: '', category: 'Software', amount: 0, date: new Date().toISOString().split('T')[0] });
        }
    }, [expenseData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{expenseData ? 'Edit Expense' : 'Add New Expense'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><label>Description</label><input type="text" name="description" value={formData.description} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Category</label><select name="category" value={formData.category} onChange={handleChange}><option>Software</option><option>Hardware</option><option>Marketing</option><option>Contractors</option><option>Utilities</option><option>Other</option></select></div>
                    <div className="form-group"><label>Amount ($)</label><input type="number" name="amount" step="0.01" min="0" value={formData.amount} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Date</label><input type="date" name="date" value={formData.date} onChange={handleChange} required /></div>
                    <div className="form-actions"><button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button><button type="submit" className="btn btn-primary">Save Expense</button></div>
                </form>
            </div>
        </div>
    );
};

export default ExpenseFormModal;