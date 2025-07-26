import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ServiceFormModal from '../components/ServiceFormModal';
import ConfirmModal from '../components/ConfirmModal';
import api from '../api/axios'; // <-- Import the configured api instance

const ServicesPage = () => {
    const [services, setServices] = useState([]);
    const [isFormOpen, setFormOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const { user } = useContext(AuthContext);

    const fetchServices = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // --- Use the 'api' instance for the request ---
            const { data } = await api.get('/api/services', config);
            setServices(data);
        } catch (error) {
            console.error("Failed to fetch services", error);
        }
    };

    useEffect(() => { if (user) fetchServices(); }, [user]);

    const handleSave = async (formData) => {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        if (editingService) {
            await api.put(`/api/services/${editingService._id}`, formData, config);
        } else {
            await api.post('/api/services', formData, config);
        }
        fetchServices();
        setFormOpen(false);
    };

    const handleConfirmDelete = async () => {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await api.delete(`/api/services/${deletingId}`, config);
        fetchServices();
        setDeletingId(null);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Manage Website Services</h1>
                <button className="btn btn-primary" onClick={() => { setEditingService(null); setFormOpen(true); }}>Add New Service</button>
            </div>
            <div className="table-container">
                <table className="pro-table">
                    <thead><tr><th>Name</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {services.map((service) => (
                            <tr key={service._id}>
                                <td>{service.name}</td>
                                <td>{service.price}</td>
                                <td>{service.isActive ? <span className="status status-active">Active</span> : <span className="status status-inactive">Hidden</span>}</td>
                                <td>
                                    <button className="btn btn-secondary btn-sm" onClick={() => { setEditingService(service); setFormOpen(true); }}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => setDeletingId(service._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ServiceFormModal isOpen={isFormOpen} onClose={() => setFormOpen(false)} onSave={handleSave} serviceData={editingService} />
            <ConfirmModal isOpen={!!deletingId} onClose={() => setDeletingId(null)} onConfirm={handleConfirmDelete} title="Delete Service" message="Are you sure you want to permanently delete this service?" />
        </div>
    );
};

export default ServicesPage;