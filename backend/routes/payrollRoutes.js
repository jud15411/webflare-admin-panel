import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { generatePayrollReport } from '../controllers/payrollController.js';

const router = express.Router();

// CORRECTED: Chained the route handler
router.route('/').get(protect, hasRole('ceo'), generatePayrollReport);

export default router;