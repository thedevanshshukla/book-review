
// src/services/api.js
import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('user')) {
    const token = JSON.parse(localStorage.getItem('user')).token;
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;