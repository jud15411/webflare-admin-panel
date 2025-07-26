import axios from 'axios';

// Get the API URL from the environment variables, with a fallback for local dev
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create a new instance of axios with a custom config
const api = axios.create({
  baseURL: API_URL
});

export default api;