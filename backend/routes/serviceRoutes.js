import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { getServices, createService, updateService, deleteService } from '../controllers/serviceController.js';

const router = express.Router();

// All service management routes are protected and for CEO only
router.use(protect, hasRole('ceo'));

router.route('/')
    .get(getServices)
    .post(createService);

router.route('/:id')
    .put(updateService)
    .delete(deleteService);

export default router;