import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { BusinessContext } from '../contexts/BusinessContext';
import './SettingsPage.css';
import api from '../api/axios';
import TransferOwnershipModal from '../components/TransferOwnershipModal';
import ConfirmModal from '../components/ConfirmModal';

// --- Helper Render Components ---
const ProfileSettings = ({ user }) => (
    <div className="settings-card">
        <h3>My Profile</h3>
        <p>Manage your personal information and password.</p>
        <form>
            <div className="form-group">
                <label>Name</label>
                <input type="text" defaultValue={user?.name} />
            </div>
            <div className="form-group">
                <label>Email</label>
                <input type="email" defaultValue={user?.email} disabled />
            </div>
            <div className="form-actions">
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
        </form>
    </div>
);

const BusinessSettings = ({ businessName, setBusinessName, setLogoFile, onSave }) => (
    <div className="settings-card">
        <h3>Company Profile</h3>
        <p>Update your company's branding and public information.</p>
        <form onSubmit={onSave}>
            <div className="form-group">
                <label>Business Name</label>
                <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Company Logo</label>
                <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
            </div>
            <div className="form-actions">
                <button type="submit" className="btn btn-primary">Save Business Info</button>
            </div>
        </form>
    </div>
);

const BillingSettings = ({ stripePublishableKey, setStripePublishableKey, stripeSecretKey, setStripeSecretKey, defaultInvoiceTerms, setDefaultInvoiceTerms, onSave }) => (
     <div className="settings-card">
       <h3>Billing & Payments</h3>
       <p>Connect payment gateways and manage invoice settings.</p>
       <form onSubmit={onSave}>
           <div className="form-group">
                <label>Stripe Publishable Key</label>
                <input 
                    type="text" 
                    placeholder="pk_live_..." 
                    value={stripePublishableKey}
                    onChange={(e) => setStripePublishableKey(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Stripe Secret Key</label>
                <input 
                    type="password" 
                    placeholder="Enter new secret key to update" 
                    value={stripeSecretKey}
                    onChange={(e) => setStripeSecretKey(e.target.value)}
                />
                <small>For security, your existing secret key is not shown. Leave this blank if you don't want to change it.</small>
            </div>
            <div className="form-group">
                <label>Default Invoice Terms</label>
                <textarea 
                    rows="3" 
                    value={defaultInvoiceTerms}
                    onChange={(e) => setDefaultInvoiceTerms(e.target.value)}
                />
            </div>
            <div className="form-actions">
                <button type="submit" className="btn btn-primary">Save Billing Settings</button>
            </div>
       </form>
    </div>
);

const DangerZone = ({ user }) => {
    // --- State for Transfer Ownership Flow ---
    const [confirmStep, setConfirmStep] = useState(0); // 0=idle, 1,2,3=confirm steps
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
    const [isTransferModalOpen, setTransferModalOpen] = useState(false);

    // --- State for Wipe Data Flow ---
    const [wipeConfirm, setWipeConfirm] = useState('');

    const handleTransferClick = () => {
        // Start the confirmation sequence
        setConfirmStep(1);
        setConfirmModalOpen(true);
    };

    const handleConfirmTransfer = () => {
        const nextStep = confirmStep + 1;
        setConfirmStep(nextStep);

        if (nextStep > 3) {
            // After 3 confirmations, close the modal and show the password prompt
            setConfirmModalOpen(false);
            setShowPasswordPrompt(true);
            setConfirmStep(0); // Reset for next time
        }
    };

    const handleCancelTransfer = () => {
        // If the user cancels at any point, reset the flow
        setConfirmModalOpen(false);
        setConfirmStep(0);
    };

    const handlePasswordSubmit = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await api.post('/api/users/verify-password', { password }, config);
            setShowPasswordPrompt(false);
            setTransferModalOpen(true);
        } catch (error) {
            alert('Incorrect password.');
        } finally {
            setPassword('');
        }
    };
    
    const handleWipeData = async () => {
        if (wipeConfirm !== 'wipe all data') {
            alert('You must type "wipe all data" to confirm.');
            return;
        }
        if (window.confirm('FINAL WARNING: This will permanently delete all clients, projects, invoices, etc. This cannot be undone. Proceed?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await api.delete('/api/settings/wipe-all-data', config);
                alert('All transactional data has been wiped.');
                window.location.reload();
            } catch (error) {
                alert('Failed to wipe data.');
            }
        }
    };

    return (
        <div className="settings-card danger-zone">
            <h3>Danger Zone</h3>
            
            <div className="danger-action">
                <div>
                    <strong>Transfer Ownership</strong>
                    <p>Transfer CEO role to another user. You will be demoted and lose permissions.</p>
                </div>
                <button onClick={handleTransferClick} className="btn btn-danger">Transfer</button>
            </div>
            {showPasswordPrompt && (
                <div className="password-prompt">
                    <p>Enter your password to proceed.</p>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    <button onClick={handlePasswordSubmit} className="btn btn-primary">Verify</button>
                </div>
            )}
            
            <div className="danger-action">
                <div>
                    <strong>Wipe All Data</strong>
                    <p>Permanently delete all clients, projects, invoices, contracts, proposals, and time logs.</p>
                </div>
                <div className="wipe-confirmation">
                    <input type="text" placeholder='Type "wipe all data" to enable' value={wipeConfirm} onChange={e => setWipeConfirm(e.target.value)} />
                    <button onClick={handleWipeData} className="btn btn-danger" disabled={wipeConfirm !== 'wipe all data'}>Wipe Data</button>
                </div>
            </div>

            {isTransferModalOpen && <TransferOwnershipModal user={user} onClose={() => setTransferModalOpen(false)} />}
            
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={handleCancelTransfer}
                onConfirm={handleConfirmTransfer}
                title="Confirm Ownership Transfer"
                message={`This is a critical action that cannot be undone. Are you sure you want to proceed? (Confirmation ${confirmStep} of 3)`}
            />
        </div>
    );
};


// --- Main Page Component ---
const Settings = () => {
  const { user } = useContext(AuthContext);
  const { settings, fetchBusinessSettings } = useContext(BusinessContext);
  const [activeTab, setActiveTab] = useState('profile');

  // State for forms
  const [businessName, setBusinessName] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [stripePublishableKey, setStripePublishableKey] = useState('');
  const [defaultInvoiceTerms, setDefaultInvoiceTerms] = useState('');

  useEffect(() => {
    if (settings) {
        setBusinessName(settings.businessName || '');
        setStripePublishableKey(settings.stripePublishableKey || '');
        setDefaultInvoiceTerms(settings.defaultInvoiceTerms || '');
    }
  }, [settings]);

  const handleBusinessSave = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('businessName', businessName);
      if (logoFile) {
          formData.append('logoFile', logoFile);
      }
      try {
          const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` } };
          await api.put('/api/settings', formData, config);
          await fetchBusinessSettings();
          alert('Business settings updated successfully!');
      } catch (error) {
          alert('Failed to update settings.');
          console.error(error);
      }
  };
  
  const handleBillingSave = async (e) => {
    e.preventDefault();
    const billingData = { stripePublishableKey, defaultInvoiceTerms };
    if (stripeSecretKey) {
        billingData.stripeSecretKey = stripeSecretKey;
    }
    try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await api.put('/api/settings', billingData, config);
        await fetchBusinessSettings();
        alert('Billing settings updated!');
        setStripeSecretKey('');
    } catch (error) {
        alert('Failed to update billing settings.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Settings</h1>
      </div>
      <div className="settings-layout">
        <div className="settings-nav">
          <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}>Profile</button>
          {user?.role === 'ceo' && (
            <>
              <button onClick={() => setActiveTab('business')} className={activeTab === 'business' ? 'active' : ''}>Business</button>
              <button onClick={() => setActiveTab('billing')} className={activeTab === 'billing' ? 'active' : ''}>Billing</button>
              <button onClick={() => setActiveTab('danger')} className={activeTab === 'danger' ? 'active' : ''}>Danger Zone</button>
            </>
          )}
        </div>
        <div className="settings-content">
          {activeTab === 'profile' && <ProfileSettings user={user} />}
          {user?.role === 'ceo' && activeTab === 'business' && (
            <BusinessSettings 
                businessName={businessName}
                setBusinessName={setBusinessName}
                setLogoFile={setLogoFile}
                onSave={handleBusinessSave}
            />
          )}
          {user?.role === 'ceo' && activeTab === 'billing' && (
            <BillingSettings 
                stripePublishableKey={stripePublishableKey}
                setStripePublishableKey={setStripePublishableKey}
                stripeSecretKey={stripeSecretKey}
                setStripeSecretKey={setStripeSecretKey}
                defaultInvoiceTerms={defaultInvoiceTerms}
                setDefaultInvoiceTerms={setDefaultInvoiceTerms}
                onSave={handleBillingSave}
            />
          )}
          {user?.role === 'ceo' && activeTab === 'danger' && <DangerZone user={user} />}
        </div>
      </div>
    </div>
  );
};

export default Settings;