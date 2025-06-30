import axios from 'axios';

// Cria uma "instância" do axios com configurações padrão
const api = axios.create({
  baseURL: 'http://localhost:3000', // O endereço base do nosso backend
});

// Isto é um "interceptor": uma função que "intercepta" todos os pedidos
// antes de eles serem enviados. É o nosso "segurança" que anexa o crachá.
api.interceptors.request.use(async (config) => {
  // Pega o token do armazenamento local do navegador
  const token = localStorage.getItem('authToken');
  if (token) {
    // Se o token existir, adiciona-o ao cabeçalho de autorização
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;