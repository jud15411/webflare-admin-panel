import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Software', 'Hardware', 'Marketing', 'Contractors', 'Utilities', 'Other'],
    required: true,
  },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;