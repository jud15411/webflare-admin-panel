import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { getSummaryReport } from '../controllers/reportController.js';

const router = express.Router();

router.route('/summary').get(protect, hasRole('ceo'), getSummaryReport);

export default router;