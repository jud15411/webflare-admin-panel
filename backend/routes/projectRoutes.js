import express from 'express';
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
    .get(getProjects)
    .post(hasRole('ceo', 'cto'), createProject); // Only CEO and CTO can create

router.route('/:id')
    .put(hasRole('ceo', 'cto'), updateProject) // Only CEO and CTO can update
    .delete(hasRole('ceo'), deleteProject); // Only CEO can delete

export default router;