import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Imports das páginas
import LoginPage from './pages/login/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ClientesPage from './pages/clientes/ClientesPage';
import ClienteFormPage from './pages/clientes/ClienteFormPage';
import ClienteDetailPage from './pages/clientes/ClienteDetailPage';
import ClienteEditPage from './pages/clientes/ClienteEditPage';
import OrcamentosPage from './pages/orcamentos/OrcamentosPage';
import OrcamentoDetailPage from './pages/orcamentos/OrcamentoDetailPage';

// Imports dos componentes
import MainLayout from './components/layout/MainLayout';
import AlertModal from './components/common/AlertModal'; // Importa nosso novo modal

const PrivateWrapper = ({ isAuthenticated, onLogout }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout onLogout={onLogout} />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [clientes, setClientes] = useState([]);
  const [filtrosClientes, setFiltrosClientes] = useState({ tipo: 'nome', termo: '' });
  const [buscaRealizada, setBuscaRealizada] = useState(false);

  // --- INÍCIO DAS NOVAS ADIÇÕES ---
  // Estado para controlar o modal de alerta
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: ''
  });

  // Efeito que "ouve" o sinal de sessão expirada
  useEffect(() => {
    const handleSessionExpired = () => {
      setIsAuthenticated(false);
      setAlertModal({
        isOpen: true,
        title: 'Sessão Expirada',
        message: 'Sua sessão terminou. Por favor, faça o login novamente para continuar.'
      });
    };

    window.addEventListener('sessionExpired', handleSessionExpired);

    // Limpa o "ouvinte" quando o componente é desmontado para evitar vazamentos de memória
    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired);
    };
  }, []);

  // Função para fechar o modal e redirecionar
  const handleAlertModalClose = () => {
    setAlertModal({ isOpen: false, title: '', message: '' });
    window.location.href = '/login';
  };
  // --- FIM DAS NOVAS ADIÇÕES ---

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
      
      {/* Renderiza o modal de alerta aqui */}
      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        onClose={handleAlertModalClose}
      />

      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <LoginPage onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />} 
        />
        
        <Route element={<PrivateWrapper isAuthenticated={isAuthenticated} onLogout={handleLogout} />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          <Route 
            path="/clientes" 
            element={
              <ClientesPage 
                clientes={clientes}
                setClientes={setClientes}
                filtros={filtrosClientes}
                setFiltros={setFiltrosClientes}
                buscaRealizada={buscaRealizada}
                setBuscaRealizada={setBuscaRealizada}
              />
            } 
          />
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