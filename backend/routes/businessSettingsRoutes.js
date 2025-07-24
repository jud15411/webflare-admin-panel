import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { getBusinessSettings, updateBusinessSettings, getPublicBusinessSettings } from '../controllers/businessSettingsController.js';

const router = express.Router();

router.get('/public', getPublicBusinessSettings);

router.route('/')
    .get(protect, hasRole('ceo'), getBusinessSettings)
    .put(protect, hasRole('ceo'), updateBusinessSettings);

export default router;