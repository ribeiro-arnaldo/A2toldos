import axios from 'axios';

const api = axios.create({
baseURL: 'https://a2toldos-backend.onrender.com',
//baseURL: 'http://localhost:3000',
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      
       window.dispatchEvent(new Event('sessionExpired'));
    }
    
    return Promise.reject(error);
  }
);

export default api;