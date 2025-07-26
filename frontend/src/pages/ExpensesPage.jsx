// pages/ExpensesPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ExpenseFormModal from '../components/ExpenseFormModal';
import ConfirmModal from '../components/ConfirmModal';
import api from '../api/axios';

const ExpensesPage = () => {
    const [expenses, setExpenses] = useState([]);
    const [isFormOpen, setFormOpen] = useState(false);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const { user } = useContext(AuthContext);

    const fetchExpenses = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await api.get('/api/expenses', config);
            setExpenses(data);
        } catch (error) { console.error('Failed to fetch expenses', error); }
    };

    useEffect(() => { if (user) fetchExpenses(); }, [user]);
    
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const handleSave = async (formData) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            if (editingExpense) {
                await api.put(`/api/expenses/${editingExpense._id}`, formData, config);
            } else {
                await api.post('/api/expenses', formData, config);
            }
            fetchExpenses();
            setFormOpen(false);
        } catch (error) { alert('Failed to save expense.'); }
    };

    const handleDeleteRequest = (id) => { setDeletingId(id); setConfirmOpen(true); };
    const handleConfirmDelete = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await api.delete(`/api/expenses/${deletingId}`, config);
            fetchExpenses();
        } catch (error) { alert('Failed to delete expense.'); }
        finally { setConfirmOpen(false); setDeletingId(null); }
    };

    return (
        <div className="page-container">
            <div className="page-header"><h1>Expense Tracking</h1><button className="btn btn-primary" onClick={() => { setEditingExpense(null); setFormOpen(true); }}>Add New Expense</button></div>
            <div className="stat-cards-grid" style={{ marginBottom: '30px' }}><div className="stat-card"><div className="stat-card-info"><span className="stat-card-title">Total Expenses Logged</span><span className="stat-card-value">${totalExpenses.toLocaleString()}</span></div></div></div>
            <div className="table-container">
                <table className="pro-table">
                    <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th>Actions</th></tr></thead>
                    <tbody>
                        {expenses.map((exp) => (
                            <tr key={exp._id}>
                                <td>{new Date(exp.date).toLocaleDateString()}</td>
                                <td>{exp.description}</td>
                                <td>{exp.category}</td>
                                <td>${exp.amount.toFixed(2)}</td>
                                <td>
                                    <button className="btn btn-secondary btn-sm" onClick={() => { setEditingExpense(exp); setFormOpen(true); }}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRequest(exp._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ExpenseFormModal isOpen={isFormOpen} onClose={() => setFormOpen(false)} onSave={handleSave} expenseData={editingExpense} />
            <ConfirmModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} title="Delete Expense" message="Are you sure you want to permanently delete this expense?" />
        </div>
    );
};

export default ExpensesPage;