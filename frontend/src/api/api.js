import axios from 'axios';
// O toast não é mais necessário aqui
// import toast from 'react-hot-toast'; 

const api = axios.create({
  baseURL: 'http://localhost:3000',
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
      
      // AQUI ESTÁ A MUDANÇA
      // Em vez de mostrar um toast, nós disparamos um evento customizado.
      // A aplicação principal (App.jsx) estará ouvindo por este evento.
      window.dispatchEvent(new Event('sessionExpired'));
    }
    
    return Promise.reject(error);
  }
);

export default api;