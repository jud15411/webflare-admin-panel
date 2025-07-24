import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { createTimeLog, getMyTimeLogs, getAllTimeLogs } from '../controllers/timeLogController.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .post(createTimeLog)
    .get(hasRole('ceo', 'cto'), getAllTimeLogs);

router.route('/mylogs').get(getMyTimeLogs);

export default router;