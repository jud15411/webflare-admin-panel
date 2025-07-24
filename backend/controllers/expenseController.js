import Expense from '../models/Expense.js';

// @desc    Get all expenses
export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({}).sort({ date: -1 });
        res.json(expenses);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

// @desc    Create a new expense
export const createExpense = async (req, res) => {
    try {
        const expense = new Expense({ ...req.body });
        const createdExpense = await expense.save();
        res.status(201).json(createdExpense);
    } catch (error) { res.status(400).json({ message: 'Invalid expense data' }); }
};

// @desc    Update an expense
export const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (expense) {
            Object.assign(expense, req.body);
            const updatedExpense = await expense.save();
            res.json(updatedExpense);
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) { res.status(400).json({ message: 'Update failed' }); }
};

// @desc    Delete an expense
export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (expense) {
            await expense.remove();
            res.json({ message: 'Expense removed' });
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};