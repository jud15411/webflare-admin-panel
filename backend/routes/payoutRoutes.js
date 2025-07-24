import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { getPayouts, requestPayout, approveAndSendPayout } from '../controllers/payoutController.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getPayouts)
    .post(requestPayout);

router.route('/:id/approve').put(hasRole('ceo', 'cto'), approveAndSendPayout);

export default router;