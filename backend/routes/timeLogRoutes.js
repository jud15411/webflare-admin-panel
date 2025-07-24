import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { getAllTimeLogs } from '../controllers/timeLogController.js';

const router = express.Router();
router.use(protect);

// CORRECTED: Chained the route handler
router.route('/').get(hasRole('ceo', 'cto'), getAllTimeLogs);

export default router;