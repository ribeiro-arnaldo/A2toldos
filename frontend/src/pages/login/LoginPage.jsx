import React, { useState } from "react";
import { FiLogIn, FiMail, FiLock } from "react-icons/fi";
import toast from "react-hot-toast";

import api from "../../api/api";
import logoA2Toldos from "../../assets/LogoA2Toldos.png";
import AlertModal from "../../components/common/AlertModal";

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const [loginErrorModal, setLoginErrorModal] = useState({
    isOpen: false,
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !senha) {
      toast.error("Por favor, preencha o e-mail e a senha.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/login", { email, senha });
      const token = response.data.token;

      if (token) {
        onLoginSuccess(token);
        toast.success("Login realizado com sucesso!");
      } else {
        setLoginErrorModal({
          isOpen: true,
          message: "Resposta inválida do servidor.",
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.erro ||
        "Erro ao fazer login. Verifique suas credenciais.";
      setLoginErrorModal({ isOpen: true, message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {" "}
      <AlertModal
        isOpen={loginErrorModal.isOpen}
        title="Login Inválido"
        message={loginErrorModal.message}
        onClose={() => setLoginErrorModal({ isOpen: false, message: "" })}
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center mb-8">
            <img
              src={logoA2Toldos}
              alt="Logo A2 Toldos"
              className="w-48 mx-auto"
            />
            <h1 className="text-2xl font-bold text-brand-blue mt-4">
              Acesso ao Sistema
            </h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                E-mail
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiMail className="text-gray-400" />
                </span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  placeholder="seuemail@exemplo.com"
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiLock className="text-gray-400" />
                </span>
                <input
                  type="password"
                  id="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  placeholder="Sua senha"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
            >
              <FiLogIn className="mr-2" />
              {loading ? "A entrar..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
