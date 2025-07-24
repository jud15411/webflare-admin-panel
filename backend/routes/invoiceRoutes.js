import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice } from '../controllers/invoiceController.js';

const router = express.Router();
router.use(protect, hasRole('ceo', 'sales'));

router.route('/').get(getInvoices).post(createInvoice);
router.route('/:id').put(updateInvoice).delete(deleteInvoice);

export default router;