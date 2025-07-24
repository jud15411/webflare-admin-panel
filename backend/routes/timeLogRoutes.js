import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import {
    createTimeLog,
    getMyTimeLogs,
    getAllTimeLogs,
} from '../controllers/timeLogController.js';

const router = express.Router();

// Apply 'protect' middleware to all routes in this file
router.use(protect);

// Any authenticated user can create a time log for themselves
router.post('/', createTimeLog);

// Any authenticated user can get their own time logs
router.get('/mylogs', getMyTimeLogs);

// Only CEO and CTO can get all time logs from every user
router.route('/').get(hasRole('ceo', 'cto'), getAllTimeLogs);

export default router;