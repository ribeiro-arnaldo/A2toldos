import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import toast from "react-hot-toast";
import logoA2Toldos from "../../assets/LogoA2Toldos.png";
import { FiLogIn, FiLoader } from "react-icons/fi";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !senha) {
      toast.error("Por favor, preencha o e-mail e a senha.");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, senha });
      const { token } = response.data;

      login(token);

      navigate("/");
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.erro || "E-mail ou senha incorretos.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <img
            src={logoA2Toldos}
            alt="Logo A2 Toldos"
            className="w-48 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">
            Acesso ao Sistema
          </h1>
          <p className="text-gray-600">Faça o login para continuar</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow"
              placeholder="seuemail@exemplo.com"
            />
          </div>
          <div>
            <label
              htmlFor="senha"
              className="text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              id="senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow"
              placeholder="Sua senha"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:bg-gray-400"
            >
              {loading ? (
                <FiLoader className="animate-spin" />
              ) : (
                <FiLogIn className="mr-2" />
              )}
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
