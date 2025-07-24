import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { getClients, createClient, updateClient, deleteClient } from '../controllers/clientController.js';

const router = express.Router();

// All routes are protected and require login
router.use(protect);

router.route('/')
    .get(getClients)
    .post(hasRole('ceo', 'sales'), createClient); // Only CEO and Sales can create

router.route('/:id')
    .put(hasRole('ceo', 'sales'), updateClient) // Only CEO and Sales can update
    .delete(hasRole('ceo', 'sales'), deleteClient); // Only CEO and Sales can delete

export default router;