import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { getSummaryReport } from '../controllers/reportController.js';

const router = express.Router();

// Protect all report routes for CEO only
router.use(protect, hasRole('ceo'));

router.get('/summary', getSummaryReport);

export default router;