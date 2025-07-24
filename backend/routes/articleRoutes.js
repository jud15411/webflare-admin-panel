import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { getArticles, getArticleById, createArticle, updateArticle, deleteArticle } from '../controllers/articleController.js';

const router = express.Router();
router.use(protect); // All routes require a login

// Anyone can view articles
router.route('/').get(getArticles);
router.route('/:id').get(getArticleById);

// Only CEO can create, update, or delete articles
router.route('/').post(hasRole('ceo'), createArticle);
router.route('/:id').put(hasRole('ceo'), updateArticle).delete(hasRole('ceo'), deleteArticle);

export default router;