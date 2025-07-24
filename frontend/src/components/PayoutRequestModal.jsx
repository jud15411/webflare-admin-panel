import React, { useState } from 'react';
import './ClientFormModal.css';

const PayoutRequestModal = ({ isOpen, onClose, onSave }) => {
    const [amount, setAmount] = useState(0);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ amount });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Request Bank Payout</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Amount ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="1.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Submit Request</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PayoutRequestModal;