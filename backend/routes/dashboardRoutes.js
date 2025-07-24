import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { getCeoDashboardSummary } from '../controllers/dashboardController.js';

const router = express.Router();

// Protect all dashboard routes for CEO only
router.get('/ceo', protect, hasRole('ceo'), getCeoDashboardSummary);

export default router;