import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { requestPayout, approveAndSendPayout, getPayouts } from '../controllers/payoutController.js';

const router = express.Router();
router.use(protect); // All routes require login

// CEO and CTO can see the list and request payouts
router.route('/')
    .get(hasRole('ceo', 'cto'), getPayouts)
    .post(hasRole('ceo', 'cto'), requestPayout);

// Only CEO can approve a payout
router.route('/:id/approve')
    .post(hasRole('ceo'), approveAndSendPayout);

export default router;