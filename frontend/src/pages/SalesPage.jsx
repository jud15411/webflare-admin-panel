// pages/SalesPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api/axios';

const SalesPage = () => {
  const [leads, setLeads] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchLeads = async () => {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data: clients } = await api.get('/api/clients', config);
      setLeads(clients.filter(client => client.status === 'Lead'));
    };
    if (user?.token) fetchLeads();
  }, [user]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Sales Leads</h1>
      </div>
      <div className="table-container">
        <table className="pro-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Contact Person</th>
              <th>Email</th>
              <th>Managed By</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td>{lead.name}</td>
                <td>{lead.contactPerson}</td>
                <td>{lead.email}</td>
                <td>{lead.managedBy?.name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesPage;