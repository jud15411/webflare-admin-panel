// pages/ClientsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ClientFormModal from '../components/ClientFormModal';
import ConfirmModal from '../components/ConfirmModal';
import api from '../api/axios';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchClients = async () => {
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    const { data } = await api.get('/api/clients', config);
    setClients(data);
  };

  useEffect(() => {
    if (user?.token) fetchClients();
  }, [user]);

  const handleOpenModal = (client = null) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleSaveClient = async (formData) => {
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    if (editingClient) {
      await api.put(`/api/clients/${editingClient._id}`, formData, config);
    } else {
      await api.post('/api/clients', formData, config);
    }
    fetchClients();
    handleCloseModal();
  };

  const handleDeleteRequest = (clientId) => {
    setClientToDelete(clientId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await api.delete(`/api/clients/${clientToDelete}`, config);
        fetchClients();
    } catch (error) {
        alert('Failed to delete client.');
        console.error(error);
    } finally {
        setIsConfirmModalOpen(false);
        setClientToDelete(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Clients</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>Add New Client</button>
      </div>

      <div className="table-container">
        <table className="pro-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Contact Person</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client._id}>
                <td>{client.name}</td>
                <td>{client.contactPerson}</td>
                <td>{client.email}</td>
                <td><span className={`status status-${client.status.toLowerCase()}`}>{client.status}</span></td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleOpenModal(client)}>Edit</button>
                  <button onClick={() => handleDeleteRequest(client._id)} className="btn btn-danger btn-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <ClientFormModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onSave={handleSaveClient}
        clientData={editingClient}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
      />
    </div>
  );
};

export default ClientsPage;