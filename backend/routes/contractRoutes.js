import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { getContracts, createContract, deleteContract } from '../controllers/contractController.js';

const router = express.Router();

// --- Multer Storage Configuration ---
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // The folder where files will be saved
  },
  filename(req, file, cb) {
    // Create a unique filename to avoid conflicts
    cb(null, `contract-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// --- Contract Routes ---
router.use(protect, hasRole('ceo')); // Only CEO can manage contracts

router.route('/')
    .get(getContracts)
    .post(upload.single('contractFile'), createContract); // 'contractFile' is the form field name

router.route('/:id')
    .delete(deleteContract);
export default router;