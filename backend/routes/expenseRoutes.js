import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../controllers/expenseController.js';

const router = express.Router();
router.use(protect, hasRole('ceo'));

router.route('/').get(getExpenses).post(createExpense);
router.route('/:id').put(updateExpense).delete(deleteExpense);

export default router;