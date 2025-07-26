// pages/SoftwareAssetsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import SoftwareAssetFormModal from '../components/SoftwareAssetFormModal';
import ConfirmModal from '../components/ConfirmModal';
import api from '../api/axios';

const SoftwareAssetsPage = () => {
    const [assets, setAssets] = useState([]);
    const [isFormOpen, setFormOpen] = useState(false);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const { user } = useContext(AuthContext);

    const fetchAssets = async () => {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await api.get('/api/software', config);
        setAssets(data);
    };

    useEffect(() => { if (user) fetchAssets(); }, [user]);

    const handleSave = async (formData) => {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        if (editingAsset) {
            await api.put(`/api/software/${editingAsset._id}`, formData, config);
        } else {
            await api.post('/api/software', formData, config);
        }
        fetchAssets();
        setFormOpen(false);
    };

    const handleDeleteRequest = (id) => { setDeletingId(id); setConfirmOpen(true); };
    const handleConfirmDelete = async () => {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await api.delete(`/api/software/${deletingId}`, config);
        fetchAssets();
        setConfirmOpen(false);
        setDeletingId(null);
    };

    return (
        <div className="page-container">
            <div className="page-header"><h1>Software & Licenses</h1><button className="btn btn-primary" onClick={() => { setEditingAsset(null); setFormOpen(true); }}>Add New Asset</button></div>
            <div className="table-container">
                <table className="pro-table">
                    <thead><tr><th>Name</th><th>Cost</th><th>Purchase Date</th><th>Renewal Date</th><th>Actions</th></tr></thead>
                    <tbody>
                        {assets.map((asset) => (
                            <tr key={asset._id}>
                                <td>{asset.name}</td><td>${asset.cost.toFixed(2)}</td><td>{new Date(asset.purchaseDate).toLocaleDateString()}</td><td>{asset.renewalDate ? new Date(asset.renewalDate).toLocaleDateString() : 'N/A'}</td>
                                <td>
                                    <button className="btn btn-secondary btn-sm" onClick={() => { setEditingAsset(asset); setFormOpen(true); }}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRequest(asset._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <SoftwareAssetFormModal isOpen={isFormOpen} onClose={() => setFormOpen(false)} onSave={handleSave} assetData={editingAsset} />
            <ConfirmModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} title="Delete Asset" message="Are you sure you want to delete this software asset?" />
        </div>
    );
};

export default SoftwareAssetsPage;