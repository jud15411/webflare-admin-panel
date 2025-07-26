import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import ConfirmModal from '../components/ConfirmModal';
import './KnowledgeBase.css';
import api from '../api/axios';

// --- NEW: Icon Helper Function ---
const getIconForCategory = (category) => {
    const lowerCaseCategory = category.toLowerCase();
    const iconMap = {
        'guide': '📘',
        'content': '📝',
        'format': '🎨',
        'sales': '💰',
        'client': '👥',
        'project': '⚙️',
        'system': '🔧',
    };

    for (const key in iconMap) {
        if (lowerCaseCategory.includes(key)) {
            return iconMap[key];
        }
    }
    return '📄'; // Default icon
};


// --- Helper Components (moved outside for performance) ---
const ArticleEditor = ({ article, setArticle, onSave, onCancel }) => (
    <form onSubmit={onSave} className="kb-editor-form">
        <div className="form-group-inline">
            <div className="form-group"><label>Title</label><input type="text" value={article.title} onChange={(e) => setArticle({ ...article, title: e.target.value })} /></div>
            <div className="form-group"><label>Category</label><input type="text" value={article.category} onChange={(e) => setArticle({ ...article, category: e.target.value })} /></div>
            <div className="form-group">
                <label>Visibility</label>
                <select value={article.visibility || 'Public'} onChange={(e) => setArticle({ ...article, visibility: e.target.value })}>
                    <option value="Public">Public (Everyone)</option>
                    <option value="CEO Only">CEO Only</option>
                </select>
            </div>
        </div>
        <div className="live-preview-container">
            <div className="form-group"><label>Content (Markdown)</label><textarea rows="20" value={article.content} onChange={(e) => setArticle({ ...article, content: e.target.value })} className="markdown-input" /></div>
            <div className="markdown-preview"><label>Live Preview</label><article className="markdown-body"><ReactMarkdown>{article.content}</ReactMarkdown></article></div>
        </div>
        <div className="form-actions"><button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button><button type="submit" className="btn btn-primary">Save Article</button></div>
    </form>
);

const ArticleViewer = ({ article, user, onEdit, onDelete }) => (
    <>
        {user?.role === 'ceo' && (
            <div className="kb-actions">
                <button className="btn btn-secondary btn-sm" onClick={onEdit}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={onDelete}>Delete</button>
            </div>
        )}
        <article className="markdown-body"><ReactMarkdown>{article.content}</ReactMarkdown></article>
    </>
);


// --- Main Page Component ---
const KnowledgeBasePage = () => {
    const [allArticles, setAllArticles] = useState([]);
    const [view, setView] = useState('categories'); // 'categories', 'articles', 'article', 'editing'
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const { user } = useContext(AuthContext);

    // Fetch all articles once on component mount
    useEffect(() => {
        if (user) {
            const fetchArticles = async () => {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await api.get('/api/articles', config);
                setAllArticles(data);
            };
            fetchArticles();
        }
    }, [user]);

    // --- Navigation Handlers ---
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setView('articles');
    };

    const handleArticleClick = async (articleId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await api.get(`/api/articles/${articleId}`, config);
            setSelectedArticle(data);
            setView('article');
        } catch (error) {
            alert("Could not fetch article details.");
        }
    };

    const handleBackToCategories = () => {
        setView('categories');
        setSelectedCategory('');
    };
    
    const handleBackToArticles = () => {
        setView('articles');
        setSelectedArticle(null);
    }

    // --- CRUD Handlers ---
    const handleSave = async (e) => {
        e.preventDefault();
        if (!selectedArticle.title.trim() || !selectedArticle.category.trim()) {
            alert('Please enter a title and category.');
            return;
        }

        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const formData = { ...selectedArticle };
        
        try {
            if (selectedArticle._id) {
                await api.put(`/api/articles/${selectedArticle._id}`, formData, config);
            } else {
                await api.post('/api/articles', formData, config);
            }
            // Refresh all data and go back to the appropriate view
            const { data } = await api.get('/api/articles', config);
            setAllArticles(data);
            setView('articles');

        } catch(error) {
            alert("Failed to save article.");
        }
    };
    
    const handleDelete = async () => {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await api.delete(`/api/articles/${selectedArticle._id}`, config);
        setConfirmOpen(false);

        // Refresh articles and go back to the articles list
        const { data } = await api.get('/api/articles', config);
        setAllArticles(data);
        setView('articles');
        setSelectedArticle(null);
    };

    const startNewArticle = () => {
        setSelectedArticle({ title: '', category: 'General', content: '## New Article', visibility: 'Public' });
        setView('editing');
    };

    // --- Data Derivation ---
    const categories = [...new Set(allArticles.map(a => a.category))];
    const articlesInCategory = allArticles.filter(a => a.category === selectedCategory);

    // --- Render Logic ---
    const renderContent = () => {
        switch (view) {
            case 'categories':
                return (
                    <div className="kb-category-grid">
                        {categories.map(category => (
                            <div key={category} className="kb-category-card" onClick={() => handleCategoryClick(category)}>
                                <div className="kb-category-icon">{getIconForCategory(category)}</div>
                                <div className="kb-category-info">
                                    <h3>{category}</h3>
                                    <p>{allArticles.filter(a => a.category === category).length} articles</p>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'articles':
                return (
                    <div>
                        <button onClick={handleBackToCategories} className="btn btn-secondary btn-sm kb-back-btn">‹ Back to Categories</button>
                        <div className="kb-article-list">
                            {articlesInCategory.map(article => (
                                <div key={article._id} className="kb-article-link" onClick={() => handleArticleClick(article._id)}>
                                    {article.title}
                                    {article.visibility === 'CEO Only' && <span className="lock-icon">🔒</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'article':
                return (
                    <div>
                         <button onClick={handleBackToArticles} className="btn btn-secondary btn-sm kb-back-btn">‹ Back to Articles</button>
                        <ArticleViewer article={selectedArticle} user={user} onEdit={() => setView('editing')} onDelete={() => setConfirmOpen(true)} />
                    </div>
                );
            case 'editing':
                return <ArticleEditor article={selectedArticle} setArticle={setSelectedArticle} onSave={handleSave} onCancel={() => selectedArticle._id ? setView('article') : setView('articles')} />;
            default:
                return null;
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Knowledge Base</h1>
                {user?.role === 'ceo' && <button className="btn btn-primary" onClick={startNewArticle}>Create New Article</button>}
            </div>
            <div className="kb-main-content">
                {renderContent()}
            </div>
            <ConfirmModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Article" message="Are you sure you want to permanently delete this article?" />
        </div>
    );
};

export default KnowledgeBasePage;