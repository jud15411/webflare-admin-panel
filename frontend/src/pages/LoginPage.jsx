import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import './LoginPage.css'; // <-- New dedicated CSS file

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (response) => {
    try {
      const { credential } = response;
      const { data } = await axios.post('/api/auth/google', { credential });
      login(data);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Google login failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to your backend login endpoint
      const { data } = await axios.post('/api/auth/login', { email, password });
      
      // Call the login function from your AuthContext
      login(data);
      
      // Navigate to the dashboard on successful login
      navigate('/dashboard');
    } catch (error) {
      // Display an error message if login fails
      alert(error.response?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Webflare Design Co.</h2>
          <p>Admin Panel Login</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-login">Sign In</button>
        </form>
        <div className="divider"><span>OR</span></div>
        <div className="google-btn-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log('Google Login Failed')}
            useOneTap
            width="300px"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;