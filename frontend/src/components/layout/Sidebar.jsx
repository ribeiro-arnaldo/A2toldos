import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiFileText, FiLogOut, FiSettings } from 'react-icons/fi';
import logoA2Toldos from '../../assets/LogoA2Toldos.png';

const Sidebar = ({ usuarioLogado, onLogout, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const activeLinkStyle = {
    backgroundColor: '#ffb634',
    color: '#06397d',
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Overlay que escurece o fundo e fecha o menu ao clicar */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMenu}
      ></div>

      {/* O menu lateral com novas classes para posicionamento e transição */}
      <div 
        className={`w-64 h-screen bg-brand-blue text-white flex flex-col shadow-lg fixed top-0 left-0 z-20 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-center border-b border-blue-700">
          <NavLink to="/dashboard" onClick={closeMenu}>
            <img src={logoA2Toldos} alt="Logo A2 Toldos" className="w-full p-4" />
          </NavLink>
        </div>
        <nav className="flex-grow p-4">
          <ul>
            <li className="mb-2">
              <NavLink to="/dashboard" onClick={closeMenu} className="flex items-center p-3 rounded-lg hover:bg-brand-yellow hover:text-brand-blue transition-colors" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}>
                <FiHome className="mr-3" />
                Dashboard
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink to="/clientes" onClick={closeMenu} className="flex items-center p-3 rounded-lg hover:bg-brand-yellow hover:text-brand-blue transition-colors" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}>
                <FiUsers className="mr-3" />
                Clientes
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink to="/orcamentos" onClick={closeMenu} className="flex items-center p-3 rounded-lg hover:bg-brand-yellow hover:text-brand-blue transition-colors" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}>
                <FiFileText className="mr-3" />
                Orçamentos
              </NavLink>
            </li>
            {usuarioLogado?.perfil === 'ADM_FULL' && (
              <li className="mb-2">
                <NavLink to="/usuarios" onClick={closeMenu} className="flex items-center p-3 rounded-lg hover:bg-brand-yellow hover:text-brand-blue transition-colors" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}>
                  <FiSettings className="mr-3" />
                  Usuários
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
        <div className="p-6 border-t border-blue-700">
          <button onClick={onLogout} className="w-full flex items-center p-3 rounded-lg hover:bg-red-600 transition-colors">
            <FiLogOut className="mr-3" />
            Sair do Sistema
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;