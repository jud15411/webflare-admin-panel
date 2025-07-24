import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { hasRole } from '../middleware/roleMiddleware.js';
import { getArticles, createArticle, updateArticle, deleteArticle } from '../controllers/articleController.js';

const router = express.Router();

router.use(protect, hasRole('ceo', 'cto'));

router.route('/')
    .get(getArticles)
    .post(createArticle);

router.route('/:id')
    .put(updateArticle)
    .delete(deleteArticle);

export default router;