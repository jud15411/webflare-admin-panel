import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const SalesPage = () => {
  const [leads, setLeads] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchLeads = async () => {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data: clients } = await axios.get('/api/clients', config);
      // Filter for clients with 'Lead' status
      setLeads(clients.filter(client => client.status === 'Lead'));
    };
    if (user?.token) fetchLeads();
  }, [user]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Sales Leads</h1>
        {/* You could have a button here to add a new lead, which is just adding a new client */}
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