import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { getProposals, createProposal, updateProposal, deleteProposal } from '../controllers/proposalController.js';

const router = express.Router();
router.use(protect, hasRole('ceo', 'sales'));

router.route('/').get(getProposals).post(createProposal);

// Add routes for specific proposal ID
router.route('/:id').put(updateProposal).delete(deleteProposal);

export default router;