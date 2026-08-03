import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/api";
import toast from "react-hot-toast";
import logoA2Toldos from "../../assets/LogoA2Toldos.png";
import { FiLoader, FiLock, FiCheckCircle } from "react-icons/fi";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (novaSenha !== confirmarSenha) {
      return toast.error("As senhas não coincidem.");
    }
    if (!token) {
      return toast.error("Token de recuperação inválido ou ausente.");
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, novaSenha });
      setSucesso(true);
      toast.success("Senha alterada com sucesso!");
      
      // Redireciona automaticamente após 3 segundos
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Erro ao redefinir a senha. O link pode ter expirado.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white border border-gray-300 rounded-xl shadow-xl">
        <div className="text-center">
          <img src={logoA2Toldos} alt="Logo A2 Toldos" className="w-48 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Nova Senha</h1>
        </div>

        {sucesso ? (
          <div className="text-center space-y-4">
            <FiCheckCircle className="text-green-500 text-6xl mx-auto" />
            <p className="text-gray-700 font-medium">Sua senha foi redefinida com sucesso!</p>
            <p className="text-sm text-gray-500">Você será redirecionado para o login em instantes...</p>
            <Link to="/login" className="block w-full py-2.5 text-center border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-brand-blue hover:bg-opacity-90">
              Ir para o Login Agora
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-gray-600 text-sm text-center mb-4">
              Crie uma nova senha de acesso forte e segura.
            </p>
            
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Nova Senha</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <FiLock size={18} />
                </span>
                <input
                  type="password"
                  required
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                  placeholder="Digite a nova senha"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Confirmar Nova Senha</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <FiLock size={18} />
                </span>
                <input
                  type="password"
                  required
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                  placeholder="Confirme a nova senha"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-brand-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:bg-gray-400 transition-colors"
              >
                {loading ? <FiLoader className="animate-spin text-lg" /> : "Redefinir Senha"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;