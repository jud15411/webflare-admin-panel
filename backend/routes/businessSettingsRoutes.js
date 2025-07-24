import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { getSettings, updateSettings } from '../controllers/businessSettingsController.js';
import BusinessSettings from '../models/BusinessSettings.js'; // Import model for public route

const router = express.Router();

// --- Multer Storage Configuration for Logo Uploads ---
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Ensure the destination folder exists
    const dir = 'uploads/logos/';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename(req, file, cb) {
    // Overwrite the logo with a consistent name to prevent multiple files
    cb(null, `logo${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });


// --- PUBLIC ROUTE ---
// This route is placed *before* the protected middleware.
// It allows the frontend to fetch the business name and logo without a login.
router.get('/public', async (req, res) => {
    try {
        const settings = await BusinessSettings.findById('main_settings');
        // If settings don't exist yet, send a default object
        res.json(settings || { businessName: 'Webflare Design Co.', logoUrl: '' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


// --- PROTECTED CEO ROUTES ---
// Any route defined below this line will require a user to be logged in and have the 'ceo' role.
router.use(protect, hasRole('ceo'));

router.route('/')
    .get(getSettings)
    .put(upload.single('logoFile'), updateSettings);

export default router;