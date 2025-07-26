// routes/timeLogRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
// Import the new delete function
import { createTimeLog, getMyTimeLogs, getAllTimeLogs, deleteTimeLog } from '../controllers/timeLogController.js';

const router = express.Router();

router.use(protect); // This protects all routes in the file

router.route('/')
    .post(createTimeLog)
    .get(hasRole('ceo', 'cto'), getAllTimeLogs);

router.route('/mylogs').get(getMyTimeLogs);

// --- NEW: Route for deleting a specific time log ---
router.route('/:id').delete(hasRole('ceo'), deleteTimeLog);


export default router;