import axios from 'axios';

// The base URL for your backend API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const updateMe = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/users/profile`, userData, config);
  return response.data;
};

const userApi = {
  updateMe,
};

export default userApi;