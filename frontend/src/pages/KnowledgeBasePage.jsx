import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import ConfirmModal from '../components/ConfirmModal';
import './KnowledgeBase.css';

const KnowledgeBasePage = () => {
    const [articles, setArticles] = useState([]);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const { user } = useContext(AuthContext);

    const fetchArticles = async () => {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/articles', config);
        setArticles(data);
    };

    useEffect(() => { if (user) fetchArticles(); }, [user]);

    const handleSelectArticle = async (articleId) => {
        if (!articleId) {
            setSelectedArticle(null);
            setIsEditing(false);
            return;
        }
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`/api/articles/${articleId}`, config);
        setSelectedArticle(data);
        setIsEditing(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const formData = { title: selectedArticle.title, content: selectedArticle.content, category: selectedArticle.category };
        if (selectedArticle._id) { // Editing existing
            await axios.put(`/api/articles/${selectedArticle._id}`, formData, config);
        } else { // Creating new
            await axios.post('/api/articles', formData, config);
        }
        setIsEditing(false);
        fetchArticles();
        handleSelectArticle(selectedArticle._id);
    };

    const handleDelete = async () => {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/articles/${selectedArticle._id}`, config);
        setConfirmOpen(false);
        setSelectedArticle(null);
        fetchArticles();
    };

    const startNewArticle = () => {
        setSelectedArticle({ title: '', category: 'General', content: '' });
        setIsEditing(true);
    };

    const ArticleEditor = () => (
        <form onSubmit={handleSave}>
            <div className="form-group"><label>Title</label><input type="text" value={selectedArticle.title} onChange={(e) => setSelectedArticle({ ...selectedArticle, title: e.target.value })} /></div>
            <div className="form-group"><label>Category</label><input type="text" value={selectedArticle.category} onChange={(e) => setSelectedArticle({ ...selectedArticle, category: e.target.value })} /></div>
            <div className="form-group"><label>Content (Markdown)</label><textarea rows="15" value={selectedArticle.content} onChange={(e) => setSelectedArticle({ ...selectedArticle, content: e.target.value })}></textarea></div>
            <div className="form-actions"><button type="button" className="btn btn-secondary" onClick={() => handleSelectArticle(selectedArticle._id)}>Cancel</button><button type="submit" className="btn btn-primary">Save Article</button></div>
        </form>
    );

    const ArticleViewer = () => (
        <>
            {user?.role === 'ceo' && (
                <div className="kb-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(true)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => setConfirmOpen(true)}>Delete</button>
                </div>
            )}
            <article className="markdown-body"><ReactMarkdown>{selectedArticle.content}</ReactMarkdown></article>
        </>
    );

    return (
        <div className="page-container">
            <div className="page-header"><h1>Knowledge Base</h1>{user?.role === 'ceo' && <button className="btn btn-primary" onClick={startNewArticle}>Create New Article</button>}</div>
            <div className="kb-layout">
                <div className="kb-sidebar"><h3>Articles</h3>{articles.map((article) => (<div key={article._id} className="kb-article-link" onClick={() => handleSelectArticle(article._id)}>{article.title}</div>))}</div>
                <div className="kb-content">
                    {!selectedArticle && <p className="kb-placeholder">Select an article or create a new one.</p>}
                    {selectedArticle && (isEditing ? <ArticleEditor /> : <ArticleViewer />)}
                </div>
            </div>
            <ConfirmModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Article" message="Are you sure you want to permanently delete this article?" />
        </div>
    );
};

export default KnowledgeBasePage;