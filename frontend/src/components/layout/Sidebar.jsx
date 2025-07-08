import React from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiUsers, FiFileText, FiLogOut, FiSettings } from "react-icons/fi";
import logoA2Toldos from "../../assets/LogoA2Toldos.png";

const Sidebar = ({ usuarioLogado, onLogout }) => {
  const activeLinkStyle = {
    backgroundColor: "#ffb634",
    color: "#06397d",
  };

  return (
    <div className="w-64 h-screen bg-brand-blue text-white flex flex-col shadow-lg">
      <div className="p-2 flex items-center justify-center border-b border-blue-700">
        <NavLink to="/dashboard">
          <img src={logoA2Toldos} alt="Logo A2 Toldos" className="w-full" />
        </NavLink>
      </div>
      <nav className="flex-grow p-4">
        <ul>
          <li className="mb-2">
            <NavLink
              to="/dashboard"
              className="flex items-center p-3 rounded-lg hover:bg-brand-yellow hover:text-brand-blue transition-colors"
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            >
              <FiHome className="mr-3" />
              Dashboard
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/clientes"
              className="flex items-center p-3 rounded-lg hover:bg-brand-yellow hover:text-brand-blue transition-colors"
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            >
              <FiUsers className="mr-3" />
              Clientes
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/orcamentos"
              className="flex items-center p-3 rounded-lg hover:bg-brand-yellow hover:text-brand-blue transition-colors"
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            >
              <FiFileText className="mr-3" />
              Orçamentos
            </NavLink>
          </li>
          {usuarioLogado?.perfil === "ADM_FULL" && (
            <li className="mb-2">
              <NavLink
                to="/usuarios"
                className="flex items-center p-3 rounded-lg hover:bg-brand-yellow hover:text-brand-blue transition-colors"
                style={({ isActive }) =>
                  isActive ? activeLinkStyle : undefined
                }
              >
                <FiSettings className="mr-3" />
                Usuários
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      <div className="p-6 border-t border-blue-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center p-3 rounded-lg hover:bg-red-600 transition-colors"
        >
          <FiLogOut className="mr-3" />
          Sair do Sistema
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
