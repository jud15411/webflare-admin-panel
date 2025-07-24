import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClientFormModal.css'; // Reuse existing modal styles

const ContractFormModal = ({ isOpen, onClose, onSave, userToken }) => {
  
  const [client, setClient] = useState('');
  const [contractFile, setContractFile] = useState(null);
  const [clients, setClients] = useState([]);

  // Fetch clients to populate the dropdown
  useEffect(() => {
    const fetchClients = async () => {
      const config = { headers: { Authorization: `Bearer ${userToken}` } };
      const { data } = await axios.get('/api/clients', config);
      setClients(data);
    };
    if (isOpen) {
      fetchClients();
    }
  }, [isOpen, userToken]);


  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contractFile) {
        alert('Please select a file to upload.');
        return;
    }
    
    // Use FormData to send file and text fields together
    const formData = new FormData();
    
    formData.append('client', client);
    formData.append('contractFile', contractFile); // 'contractFile' must match the backend route

    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Upload New Contract</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Client</label>
            <select value={client} onChange={(e) => setClient(e.target.value)} required>
                <option value="" disabled>Select a client</option>
                {clients.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label>Contract File (PDF, DOCX)</label>
            <input type="file" onChange={(e) => setContractFile(e.target.files[0])} required />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Upload & Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContractFormModal;