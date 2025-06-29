import React, { useState } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';

// Importando a sua logo a partir da pasta assets
import logoA2Toldos from '../assets/LogoA2Toldos.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Tentativa de login com:', { email, senha });
    // TODO: No futuro, aqui faremos a chamada à nossa API do backend
  };

  return (
    // Fundo da página e centralização de todo o conteúdo
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      
      {/* Caixa principal do formulário de login */}
      <div className="w-full max-w-md p-8 space-y-6 bg-brand-white rounded-xl shadow-lg">
        
        {/* Container da Logo */}
        <div className="flex justify-center">
          <img src={logoA2Toldos} alt="Logo A2 Toldos e Coberturas" className="w-48" />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-blue">
            Acesso ao Sistema
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Por favor, insira as suas credenciais para continuar.
          </p>
        </div>

        {/* Formulário */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {/* Campo de E-mail */}
          <div className="relative">
            <FiMail className="absolute w-5 h-5 text-gray-400 top-3.5 left-4" />
            <input
              name="email"
              type="email"
              required
              className="w-full pl-12 pr-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Campo de Senha */}
          <div className="relative">
            <FiLock className="absolute w-5 h-5 text-gray-400 top-3.5 left-4" />
            <input
              name="password"
              type="password"
              required
              className="w-full pl-12 pr-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <a href="#" className="font-medium text-brand-blue hover:text-brand-yellow">
                Esqueceu a sua senha?
              </a>
            </div>
          </div>

          {/* Botão de Entrar */}
          <div>
            <button
              type="submit"
              className="group relative flex justify-center w-full px-4 py-3 text-lg font-bold text-white bg-brand-blue rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-yellow transition-colors"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                <FiLogIn className="w-5 h-5" />
              </span>
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;