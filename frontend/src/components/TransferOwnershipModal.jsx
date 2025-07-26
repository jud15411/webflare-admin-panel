import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import './TransferOwnershipModal.css';

const TransferOwnershipModal = ({ user, onClose }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');

    useEffect(() => {
        // Fetch all users except the current CEO
        const fetchUsers = async () => {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await api.get('/api/users', config);
            setUsers(data.filter(u => u._id !== user._id));
        };
        fetchUsers();
    }, [user]);

    const handleTransfer = async () => {
        if (!selectedUser) {
            alert('Please select a user to transfer ownership to.');
            return;
        }
        if (window.confirm(`Are you sure you want to make ${users.find(u=>u._id === selectedUser)?.name} the new CEO? This action is irreversible.`)) {
             try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await api.put('/api/users/transfer-ownership', { newCeoId: selectedUser }, config);
                alert('Ownership transferred successfully. You will be logged out.');
                // In a real app, you would have a logout function from context here
                window.location.href = '/login';
            } catch (error) {
                alert('Failed to transfer ownership.');
            }
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Select New CEO</h2>
                    <button onClick={onClose} className="modal-close-btn">&times;</button>
                </div>
                <div className="modal-body">
                    <p>Select a team member to become the new CEO. You will be demoted to a developer role.</p>
                    <div className="form-group">
                        <label>New CEO</label>
                        <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
                            <option value="" disabled>Select a user...</option>
                            {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                        </select>
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="btn btn-secondary">Cancel</button>
                    <button onClick={handleTransfer} className="btn btn-danger">Confirm Transfer</button>
                </div>
            </div>
        </div>
    );
};

export default TransferOwnershipModal;