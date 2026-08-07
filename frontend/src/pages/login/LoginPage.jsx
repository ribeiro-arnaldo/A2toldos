import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // <-- Link adicionado aqui
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import toast from "react-hot-toast";
import logoA2Toldos from "../../assets/LogoA2Toldos.png";
import { FiLogIn, FiLoader, FiMail, FiLock } from "react-icons/fi";

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
    <div className="flex items-center justify-center min-h-screen bg-slate-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white border border-gray-300 rounded-xl shadow-xl">
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
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 block mb-1"
            >
              E-mail
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <FiMail size={18} />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-base"
                placeholder="seuemail@exemplo.com"
              />
            </div>
          </div>
          
          <div>
            <label
              htmlFor="senha"
              className="text-sm font-medium text-gray-700 block mb-1"
            >
              Senha
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <FiLock size={18} />
              </span>
              <input
                id="senha"
                name="senha"
                type="password"
                autoComplete="current-password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-base"
                placeholder="Sua senha"
              />
            </div>
            {/* LINK ESQUECI MINHA SENHA */}
            <div className="flex justify-end mt-2">
              <Link 
                to="/forgot-password" 
                className="text-sm font-medium text-brand-blue hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-brand-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:bg-gray-400 transition-colors"
            >
              {loading ? (
                <FiLoader className="animate-spin text-lg" />
              ) : (
                <>
                  <FiLogIn className="mr-2 text-lg" />
                  Entrar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;