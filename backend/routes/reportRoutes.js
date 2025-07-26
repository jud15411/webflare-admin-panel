import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
// Import the new controller functions
import {
    getSummaryReport,
    getPaidInvoicesDetail,
    getSentInvoicesDetail,
    getActiveProjectsDetail,
    getCompletedProjectsDetail,
    getActiveClientsDetail,
    getNewLeadsDetail
} from '../controllers/reportController.js';

const router = express.Router();

// This middleware applies to all routes in this file
router.use(protect, hasRole('ceo'));

// --- Main Summary Route ---
router.route('/summary').get(getSummaryReport);

// --- Detailed Report Routes ---
router.route('/details/paid-invoices').get(getPaidInvoicesDetail);
router.route('/details/sent-invoices').get(getSentInvoicesDetail);
router.route('/details/active-projects').get(getActiveProjectsDetail);
router.route('/details/completed-projects').get(getCompletedProjectsDetail);
router.route('/details/active-clients').get(getActiveClientsDetail);
router.route('/details/new-leads').get(getNewLeadsDetail);

export default router;