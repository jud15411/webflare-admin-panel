import Article from '../models/Article.js';

export const getArticles = async (req, res) => {
    try {
        const articles = await Article.find({}).select('title category');
        res.json(articles);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

export const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (article) res.json(article);
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

// @desc    Update an article
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

// @desc    Delete an article
export const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (article) {
            await article.remove();
            res.json({ message: 'Article removed' });
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};