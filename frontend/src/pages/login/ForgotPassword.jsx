import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import toast from "react-hot-toast";
import logoA2Toldos from "../../assets/LogoA2Toldos.png";
import { FiLoader, FiMail, FiArrowLeft } from "react-icons/fi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor, preencha o e-mail.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", { email });
      toast.success(response.data.message || "Se o e-mail estiver cadastrado, você receberá as instruções em instantes.");
      setEmail(""); // Limpa o campo
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Erro ao solicitar recuperação.";
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
          <h1 className="text-2xl font-bold text-gray-900">Recuperar Senha</h1>
          <p className="text-gray-600 mt-2 text-sm">
            Digite seu e-mail cadastrado. Vamos enviar um link para você redefinir sua senha.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-1">
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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-sm"
                placeholder="seuemail@exemplo.com"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-brand-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:bg-gray-400 transition-colors"
            >
              {loading ? <FiLoader className="animate-spin text-lg" /> : "Enviar link de recuperação"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link to="/login" className="inline-flex items-center text-sm font-medium text-brand-blue hover:underline">
            <FiArrowLeft className="mr-1" />
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;