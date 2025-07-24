import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import UserFormModal from '../components/UserFormModal'; // <-- Import the new modal
import './TeamPage.css';

const TeamPage = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [existingRoles, setExistingRoles] = useState({});
  const { user: loggedInUser } = useContext(AuthContext);

  const fetchUsers = async () => {
    const config = { headers: { Authorization: `Bearer ${loggedInUser.token}` } };
    const { data } = await axios.get('/api/users', config);
    setUsers(data);
    // Find if a CEO or CTO already exists for the form logic
    const ceo = data.find(u => u.role === 'ceo');
    const cto = data.find(u => u.role === 'cto');
    setExistingRoles({ ceo: ceo?._id, cto: cto?._id });
  };

  useEffect(() => {
    if (loggedInUser?.token) fetchUsers();
  }, [loggedInUser]);

  const handleSaveUser = async (formData, userId) => {
    try {
        const config = { headers: { Authorization: `Bearer ${loggedInUser.token}` } };
        if (userId) { // If there's a userId, we're editing
            await axios.put(`/api/users/${userId}`, formData, config);
        } else { // Otherwise, we're creating
            await axios.post('/api/users', formData, config);
        }
        fetchUsers();
        setIsModalOpen(false);
    } catch (error) {
        alert(error.response?.data?.message || 'An error occurred.');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
        try {
            const config = { headers: { Authorization: `Bearer ${loggedInUser.token}` } };
            await axios.delete(`/api/users/${userId}`, config);
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.message || 'Could not delete user.');
        }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Team Management</h1>
        <button className="btn btn-primary" onClick={() => { setEditingUser(null); setIsModalOpen(true); }}>Add New User</button>
      </div>
      <div className="table-container">
        <table className="pro-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Hourly Rate</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className={`status status-${user.role}`}>{user.role}</span></td>
                <td>${(user.hourlyRate || 0).toFixed(2)}</td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setEditingUser(user); setIsModalOpen(true); }}>Edit</button>
                  {user.role !== 'ceo' && (
                    <button onClick={() => handleDelete(user._id)} className="btn btn-danger btn-sm">Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        userData={editingUser}
        existingRoles={existingRoles}
      />
    </div>
  );
};

export default TeamPage;