import express from 'express';
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getProjects)
    .post(hasRole('ceo', 'cto'), createProject);

router.route('/:id')
    .put(hasRole('ceo', 'cto'), updateProject)
    .delete(hasRole('ceo'), deleteProject);

export default router;