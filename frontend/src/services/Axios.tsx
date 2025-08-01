// services/Axios.ts
import axios from 'axios';

const Axios = axios.create({
  baseURL: 'https://notes-react-typescript.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

Axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default Axios;
