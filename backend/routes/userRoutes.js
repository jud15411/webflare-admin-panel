import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js'; // You'll need this
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  verifyPassword,      
  transferOwnership,   
  wipeUserData
} from '../controllers/userController.js';

const router = express.Router();

// This middleware will apply to all routes in this file.
// It first checks if the user is authenticated (protect).
// Then it checks if the user has the role of 'ceo' or 'cto'.
router.use(protect, hasRole('ceo', 'cto'));

// Define the routes
router.route('/').get(getUsers).post(createUser);

router.route('/:id').put(updateUser).delete(deleteUser);

router.post('/verify-password', protect, verifyPassword); // New route for password verification
router.put('/transfer-ownership', protect, hasRole('ceo'), transferOwnership); // New route for transferring ownership

export default router;