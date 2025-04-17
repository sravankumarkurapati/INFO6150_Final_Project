// src/axiosInstance.js

import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || 'http://localhost:5014/api',
});

instance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default instance;
