import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { generatePayrollReport } from '../controllers/payrollController.js';

const router = express.Router();

// Only the CEO can generate payroll reports
router.get('/', protect, hasRole('ceo'), generatePayrollReport);

export default router;