import express from 'express';
import {
  protect,
  admin,
  checkObjectId,
} from '../middleware/authMiddleware.js';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController.js';

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router.route('/profile').get(protect, getUserProfile);

// Corrected Route
router.route('/profile/:id').put(protect, updateUserProfile);

router
  .route('/:id')
  .get(protect, admin, checkObjectId, getUserById)
  .put(protect, admin, checkObjectId, updateUser)
  .delete(protect, admin, checkObjectId, deleteUser);

export default router;