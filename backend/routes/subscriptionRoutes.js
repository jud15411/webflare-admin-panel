import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { getSubscriptions, createSubscription, updateSubscription, deleteSubscription } from '../controllers/subscriptionController.js';

const router = express.Router();
router.use(protect, hasRole('ceo'));

router.route('/').get(getSubscriptions).post(createSubscription);
router.route('/:id').put(updateSubscription).delete(deleteSubscription);

export default router;