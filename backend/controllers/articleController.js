// controllers/articleController.js
import Article from '../models/Article.js';

export const getArticles = async (req, res) => {
    try {
        const filter = {};
        // If the user is NOT a CEO, only show Public articles
        if (req.user.role !== 'ceo') {
            filter.visibility = 'Public';
        }
        
        const articles = await Article.find(filter).select('title category visibility');
        res.json(articles);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

export const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (article) {
             // Security check: if article is CEO-only, make sure user is CEO
            if (article.visibility === 'CEO Only' && req.user.role !== 'ceo') {
                return res.status(403).json({ message: 'Not authorized to view this article' });
            }
            res.json(article);
        }
        else res.status(404).json({ message: 'Article not found' });
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

export const createArticle = async (req, res) => {
    try {
        const article = new Article({ ...req.body });
        const createdArticle = await article.save();
        res.status(201).json(createdArticle);
    } catch (error) { res.status(400).json({ message: 'Invalid article data' }); }
};

export const updateArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (article) {
            Object.assign(article, req.body);
            const updatedArticle = await article.save();
            res.json(updatedArticle);
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) { res.status(400).json({ message: 'Update failed' }); }
};

export const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (article) {
            await article.deleteOne();
            res.json({ message: 'Article removed' });
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};