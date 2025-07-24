import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getTasks, createTask, updateTaskStatus, updateTask } from '../controllers/taskController.js';

const router = express.Router();
router.use(protect);

router.route('/').get(getTasks).post(createTask);

// This route is for general updates (title, description, etc.)
router.route('/:id').put(updateTask); 

// This route is specifically for status updates from the Kanban board
router.route('/:id/status').put(updateTaskStatus); 

export default router;