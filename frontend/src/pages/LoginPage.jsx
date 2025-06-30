import React, { useState } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import axios from 'axios';
import logoA2Toldos from '../assets/LogoA2Toldos.png';

const LoginPage = ({ onLoginSuccess }) => { 
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

    const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Tenta fazer o pedido de login.
      const response = await axios.post('http://localhost:3000/auth/login', {
        email: email,
        senha: senha,
      });

      onLoginSuccess(response.data.token);

    } catch (err) {
      
      setLoading(false); // Paramos o "a carregar".
      setError(err.response?.data?.erro || 'Ocorreu um erro. Tente novamente.');
    }
  };

   return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-brand-white rounded-xl shadow-lg">
        <div className="flex justify-center">
          <img src={logoA2Toldos} alt="Logo A2 Toldos e Coberturas" className="w-48" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-blue">Acesso ao Sistema</h2>
          <p className="mt-2 text-sm text-gray-600">Por favor, insira as suas credenciais para continuar.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Campos de e-mail e senha */}
          <div className="relative">
            <FiMail className="absolute w-5 h-5 text-gray-400 top-3.5 left-4" />
            <input name="email" type="email" required className="w-full pl-12 pr-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="relative">
            <FiLock className="absolute w-5 h-5 text-gray-400 top-3.5 left-4" />
            <input name="password" type="password" required className="w-full pl-12 pr-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow" placeholder="Sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
          </div>
          
          {/* Caixa de erro condicional */}
          {error && (<div className="p-3 text-center text-sm text-red-800 bg-red-100 rounded-lg">{error}</div>)}
          
          <div className="flex items-center justify-end">
            <div className="text-sm"><a href="#" className="font-medium text-brand-blue hover:text-brand-yellow">Esqueceu a sua senha?</a></div>
          </div>
          
          {/* Botão de Entrar */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex justify-center w-full px-4 py-3 text-lg font-bold text-white bg-brand-blue rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-yellow transition-colors disabled:bg-gray-400"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-4"><FiLogIn className="w-5 h-5" /></span>
              {loading ? 'A entrar...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;