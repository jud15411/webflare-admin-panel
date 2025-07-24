import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { getCeoDashboardSummary } from '../controllers/dashboardController.js';

const router = express.Router();

// Corrected Route Definition
router.route('/ceo').get(protect, hasRole('ceo'), getCeoDashboardSummary);

export default router;