import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { getSoftwareAssets, createSoftwareAsset, updateSoftwareAsset, deleteSoftwareAsset } from '../controllers/softwareAssetController.js';

const router = express.Router();
router.use(protect, hasRole('ceo', 'cto'));

router.route('/').get(getSoftwareAssets).post(createSoftwareAsset);
router.route('/:id').put(updateSoftwareAsset).delete(deleteSoftwareAsset);

export default router;