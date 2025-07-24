import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import ContractFormModal from '../components/ContractFormModal';
import ConfirmModal from '../components/ConfirmModal';

const ContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);
  const { user } = useContext(AuthContext);

  const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // --- THIS IS THE CORRECTED FUNCTION ---
  const fetchContracts = async () => {
    try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/contracts', config);
        setContracts(data);
    } catch (error) {
        console.error('Failed to fetch contracts', error);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchContracts();
    }
  }, [user]);

  const handleSaveContract = async (formData) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${user.token}`
            }
        };
        await axios.post('/api/contracts', formData, config);
        fetchContracts();
        setIsFormModalOpen(false);
    } catch (error) {
        alert('Failed to upload contract.');
        console.error(error);
    }
  };

  const handleDeleteRequest = (contractId) => {
    setContractToDelete(contractId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/contracts/${contractToDelete}`, config);
        fetchContracts();
    } catch (error) {
        alert('Failed to delete contract.');
        console.error(error);
    } finally {
        setIsConfirmModalOpen(false);
        setContractToDelete(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Contracts</h1>
        <button className="btn btn-primary" onClick={() => setIsFormModalOpen(true)}>Upload New Contract</button>
      </div>
      <div className="table-container">
        <table className="pro-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Client</th>
              <th>Date Uploaded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract) => (
              <tr key={contract._id}>
                <td>{contract.title}</td>
                <td>{contract.client?.name || 'N/A'}</td>
                <td>{new Date(contract.createdAt).toLocaleDateString()}</td>
                <td>
                  <a href={`${backendUrl}${contract.fileUrl}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                    View
                  </a>
                  <button onClick={() => handleDeleteRequest(contract._id)} className="btn btn-danger btn-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ContractFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveContract}
        userToken={user?.token}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Contract"
        message="Are you sure you want to permanently delete this contract and its associated file?"
      />
    </div>
  );
};

export default ContractsPage;