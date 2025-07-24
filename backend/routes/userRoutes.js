import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

// Apply CEO-only protection to all routes in this file
router.use(protect, hasRole('ceo', 'cto'));

router.route('/')
    .get(getUsers)
    .post(createUser);

router.route('/:id')
    .put(updateUser)
    .delete(deleteUser);

export default router;