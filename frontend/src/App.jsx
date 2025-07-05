import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

// Imports de todas as páginas
import LoginPage from "./pages/login/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ClientesPage from "./pages/clientes/ClientesPage";
import ClienteFormPage from "./pages/clientes/ClienteFormPage";
import ClienteDetailPage from "./pages/clientes/ClienteDetailPage";
import ClienteEditPage from "./pages/clientes/ClienteEditPage.jsx";
import OrcamentosPage from "./pages/orcamentos/OrcamentosPage";
import OrcamentoFormPage from "./pages/orcamentos/OrcamentoFormPage.jsx";
import OrcamentoDetailPage from "./pages/orcamentos/OrcamentoDetailPage";
import OrcamentoEditPage from "./pages/orcamentos/OrcamentoEditPage.jsx";
import UsuariosPage from "./pages/usuarios/UsuariosPage";

// Imports dos componentes globais
import MainLayout from "./components/layout/MainLayout";
import AlertModal from "./components/common/AlertModal";

// Componente que protege as rotas privadas
const PrivateWrapper = ({ isAuthenticated, onLogout, usuarioLogado }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout onLogout={onLogout} usuarioLogado={usuarioLogado} />;
};

function App() {
  // Estado de Autenticação e Usuário
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  // Estado para o módulo de Clientes
  const [clientes, setClientes] = useState([]);
  const [filtrosClientes, setFiltrosClientes] = useState({
    tipo: "nome",
    termo: "",
  });
  const [buscaRealizadaClientes, setBuscaRealizadaClientes] = useState(false);

  // Estado para o módulo de Orçamentos
  const [orcamentos, setOrcamentos] = useState([]);
  const [filtrosOrcamentos, setFiltrosOrcamentos] = useState({
    numero_orcamento: "",
    nome_cliente: "",
    status: "TODOS",
  });
  const [buscaRealizadaOrcamentos, setBuscaRealizadaOrcamentos] =
    useState(false);
  const [dadosPaginacaoOrcamentos, setDadosPaginacaoOrcamentos] = useState({
    pagina: 1,
    limite: 10,
    total: 0,
  });

  // Estado para o Modal de Alerta Global
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  // Efeito para "ouvir" o evento de sessão expirada
  useEffect(() => {
    const handleSessionExpired = () => {
      setIsAuthenticated(false);
      setUsuarioLogado(null);
      setAlertModal({
        isOpen: true,
        title: "Sessão Expirada",
        message:
          "Sua sessão terminou. Por favor, faça o login novamente para continuar.",
      });
    };
    window.addEventListener("sessionExpired", handleSessionExpired);
    return () => {
      window.removeEventListener("sessionExpired", handleSessionExpired);
    };
  }, []);

  // Efeito para verificar o token ao carregar a aplicação
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setUsuarioLogado(decoded);
        } else {
          localStorage.removeItem("authToken");
        }
      } catch (e) {
        console.error("Token inválido:", e);
        localStorage.removeItem("authToken");
      }
    }
    setLoading(false);
  }, []);

  const handleAlertModalClose = () => {
    setAlertModal({ isOpen: false, title: "", message: "" });
    window.location.href = "/login";
  };

  const handleLoginSuccess = (token) => {
    localStorage.setItem("authToken", token);
    const decoded = jwtDecode(token);
    setIsAuthenticated(true);
    setUsuarioLogado(decoded);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUsuarioLogado(null);
    window.location.href = "/login";
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
          success: { style: { background: "#06397d", color: "white" } },
          error: { style: { background: "#dc3545", color: "white" } },
        }}
      />
      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        onClose={handleAlertModalClose}
      />
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          element={
            <PrivateWrapper
              isAuthenticated={isAuthenticated}
              onLogout={handleLogout}
              usuarioLogado={usuarioLogado}
            />
          }
        >
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
                buscaRealizada={buscaRealizadaClientes}
                setBuscaRealizada={setBuscaRealizadaClientes}
              />
            }
          />
          <Route path="/clientes/novo" element={<ClienteFormPage />} />
          <Route path="/clientes/:id/editar" element={<ClienteEditPage />} />
          <Route path="/clientes/:id" element={<ClienteDetailPage />} />

          <Route
            path="/orcamentos"
            element={
              <OrcamentosPage
                orcamentos={orcamentos}
                setOrcamentos={setOrcamentos}
                filtros={filtrosOrcamentos}
                setFiltros={setFiltrosOrcamentos}
                buscaRealizada={buscaRealizadaOrcamentos}
                setBuscaRealizada={setBuscaRealizadaOrcamentos}
                dadosPaginacao={dadosPaginacaoOrcamentos}
                setDadosPaginacao={setDadosPaginacaoOrcamentos}
              />
            }
          />
          <Route path="/orcamentos/novo" element={<OrcamentoFormPage />} />
          <Route
            path="/orcamentos/:id/editar"
            element={<OrcamentoEditPage />}
          />
          <Route path="/orcamentos/:id" element={<OrcamentoDetailPage />} />

          <Route path="/usuarios" element={<UsuariosPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
