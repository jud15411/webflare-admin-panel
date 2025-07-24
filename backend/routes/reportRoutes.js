import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { getSummaryReport } from '../controllers/reportController.js';

const router = express.Router();
router.use(protect, hasRole('ceo'));

// CORRECTED: Chained the route handler
router.route('/summary').get(getSummaryReport);

export default router;