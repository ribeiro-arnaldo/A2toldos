import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Importa todas as nossas páginas
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClientesPage from './pages/ClientesPage';
import ClienteFormPage from './pages/ClienteFormPage'; // O formulário de criação
import ClienteDetailPage from './pages/ClienteDetailPage';
import ClienteEditPage from './pages/ClienteEditPage';
import OrcamentosPage from './pages/OrcamentosPage';
import OrcamentoDetailPage from './pages/OrcamentoDetailPage';

// Importa o nosso layout principal
import MainLayout from './components/layout/MainLayout';

// Componente "guarda" para proteger as nossas rotas
const PrivateWrapper = ({ isAuthenticated, onLogout }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // A mágica acontece aqui: O MainLayout precisa renderizar os filhos (as páginas)
  return <MainLayout onLogout={onLogout} />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // O estado da busca de clientes que vive no topo da aplicação
  const [clientes, setClientes] = useState([]);
  const [buscaRealizada, setBuscaRealizada] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="text-center p-12">A carregar aplicação...</div>;
  }

  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          success: { style: { background: '#06397d', color: 'white' } },
          error: { style: { background: '#dc3545', color: 'white' } },
        }}
      />
      <Routes>
        {/* Rota Pública de Login */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <LoginPage onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />} 
        />
        
        {/* Agrupamento de Todas as Rotas Privadas */}
        <Route element={<PrivateWrapper isAuthenticated={isAuthenticated} onLogout={handleLogout} />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          <Route 
            path="/clientes" 
            element={
              <ClientesPage 
                clientes={clientes}
                setClientes={setClientes}
                buscaRealizada={buscaRealizada}
                setBuscaRealizada={setBuscaRealizada}
              />
            } 
          />
          {/* A ORDEM AQUI É CRÍTICA */}
          <Route path="/clientes/novo" element={<ClienteFormPage />} />
          <Route path="/clientes/:id/editar" element={<ClienteEditPage />} />
          <Route path="/clientes/:id" element={<ClienteDetailPage />} />

          <Route path="/orcamentos" element={<OrcamentosPage />} />
          <Route path="/orcamentos/:id" element={<OrcamentoDetailPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;