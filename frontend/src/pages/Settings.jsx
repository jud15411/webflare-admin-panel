import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { BusinessContext } from '../contexts/BusinessContext';
import './SettingsPage.css';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const { settings, fetchBusinessSettings } = useContext(BusinessContext);
  const [activeTab, setActiveTab] = useState('profile');

  // State for the business settings form
  const [businessName, setBusinessName] = useState('');
  const [logoFile, setLogoFile] = useState(null);

  // When settings are loaded into the context, update the form state
  useEffect(() => {
    if (settings) {
        setBusinessName(settings.businessName);
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
          const config = { 
              headers: { 
                  'Content-Type': 'multipart/form-data', 
                  Authorization: `Bearer ${user.token}` 
              } 
          };
          await axios.put('/api/settings', formData, config);
          await fetchBusinessSettings(); // This refreshes the context for the whole app
          alert('Business settings updated successfully!');
      } catch (error) {
          alert('Failed to update settings.');
          console.error(error);
      }
  };

  // --- RENDER FUNCTIONS FOR EACH TAB ---

  const renderProfileSettings = () => (
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

  const renderBusinessSettings = () => (
    <div className="settings-card">
      <h3>Company Profile</h3>
      <p>Update your company's branding and public information.</p>
      <form onSubmit={handleBusinessSave}>
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
  
  const renderBillingSettings = () => (
    <div className="settings-card">
       <h3>Billing & Payments</h3>
       <p>Connect payment gateways and manage invoice settings.</p>
       <div className="form-group">
        <label>Stripe API Key</label>
        <input type="password" placeholder="sk_live_************************" />
      </div>
      <div className="form-group">
        <label>Default Invoice Terms</label>
        <textarea rows="3" defaultValue="Payment due within 30 days."></textarea>
      </div>
       <div className="form-actions">
          <button type="submit" className="btn btn-primary">Save Billing Settings</button>
        </div>
    </div>
  );

  const renderDangerZone = () => (
    <div className="settings-card danger-zone">
      <h3>Danger Zone</h3>
      <p>These are critical, potentially irreversible actions.</p>
      <div className="danger-action">
          <div>
              <strong>Transfer Ownership</strong>
              <p>Transfer this company to another user. You will lose all ownership permissions.</p>
          </div>
          <button className="btn btn-danger">Transfer</button>
      </div>
    </div>
  );

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
          {activeTab === 'profile' && renderProfileSettings()}
          {user?.role === 'ceo' && activeTab === 'business' && renderBusinessSettings()}
          {user?.role === 'ceo' && activeTab === 'billing' && renderBillingSettings()}
          {user?.role === 'ceo' && activeTab === 'danger' && renderDangerZone()}
        </div>
      </div>
    </div>
  );
};

export default Settings;