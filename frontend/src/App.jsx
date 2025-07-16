import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

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
import UsuariosEditPage from "./pages/usuarios/UsuariosEditPage";
import UsuariosFormPage from "./pages/usuarios/UsuariosFormPage";

// Imports dos componentes globais
import PrivateWrapper from "./components/layout/PrivateWrapper";

function App() {
  return (
    <AuthProvider>
      {" "}
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            success: { style: { background: "#06397d", color: "white" } },
            error: { style: { background: "#dc3545", color: "white" } },
          }}
        />
        <Routes>
          {/*  Rota pública para o Login */}
          <Route path="/login" element={<LoginPage />} />

          {/*  Todas as rotas privadas são agrupadas e protegidas pelo PrivateWrapper */}
          <Route element={<PrivateWrapper />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/clientes/novo" element={<ClienteFormPage />} />
            <Route path="/clientes/:id/editar" element={<ClienteEditPage />} />
            <Route path="/clientes/:id" element={<ClienteDetailPage />} />

            <Route path="/orcamentos" element={<OrcamentosPage />} />
            <Route path="/orcamentos/novo" element={<OrcamentoFormPage />} />
            <Route
              path="/orcamentos/:id/editar"
              element={<OrcamentoEditPage />}
            />
            <Route path="/orcamentos/:id" element={<OrcamentoDetailPage />} />

            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/usuarios/novo" element={<UsuariosFormPage />} />
            <Route path="/usuarios/:id/editar" element={<UsuariosEditPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
