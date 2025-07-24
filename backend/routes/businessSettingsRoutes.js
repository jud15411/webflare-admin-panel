import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
// CORRECTED: Changed getBusinessSettings to getSettings
import { getSettings, updateBusinessSettings, getPublicBusinessSettings } from '../controllers/businessSettingsController.js';

const router = express.Router();

router.get('/public', getPublicBusinessSettings);

router.route('/')
    // CORRECTED: Changed getBusinessSettings to getSettings
    .get(protect, hasRole('ceo'), getSettings)
    .put(protect, hasRole('ceo'), updateBusinessSettings);

export default router;