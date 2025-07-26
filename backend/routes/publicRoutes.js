import express from 'express';
import { getPublicServices } from '../controllers/serviceController.js';

const router = express.Router();

// This route is public and does not require authentication
router.route('/services').get(getPublicServices);

export default router;