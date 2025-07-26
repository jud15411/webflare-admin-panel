// userApi.js
import api from './api/axios';

const updateMe = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.put('/api/users/profile', userData, config);
  return response.data;
};

const userApi = {
  updateMe,
};

export default userApi;