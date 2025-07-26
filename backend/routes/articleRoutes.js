import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { getArticles, getArticleById, createArticle, updateArticle, deleteArticle } from '../controllers/articleController.js';

const router = express.Router();

router.route('/')
    .get(protect, getArticles)
    .post(protect, hasRole('ceo'), createArticle);

router.route('/:id')
    .get(protect, getArticleById)
    .put(protect, hasRole('ceo'), updateArticle)
    .delete(protect, hasRole('ceo'), deleteArticle);

export default router;