import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createCheckoutSession } from '../controllers/stripeController.js';

const router = express.Router();

router.route('/create-checkout-session').post(protect, createCheckoutSession);

export default router;