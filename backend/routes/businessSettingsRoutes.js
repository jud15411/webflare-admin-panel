import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { getSettings, updateSettings, wipeAllData } from '../controllers/businessSettingsController.js';

const router = express.Router();

// --- NEW: Multer Configuration for Logo Uploads ---
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/logos/'); // Specific folder for logos
  },
  filename(req, file, cb) {
    cb(null, `logo${path.extname(file.originalname)}`); // Overwrite the existing logo for simplicity
  },
});

const upload = multer({ storage });

// --- UPDATED ROUTE ---
// The .put route now uses the upload middleware
router.route('/')
    .get(protect, hasRole('ceo'), getSettings)
    .put(protect, hasRole('ceo'), upload.single('logoFile'), updateSettings);


router.route('/wipe-all-data').delete(protect, hasRole('ceo'), wipeAllData);


export default router;