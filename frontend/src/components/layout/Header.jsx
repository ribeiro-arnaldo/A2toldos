import React from "react";
import { FiMenu } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const Header = ({ setIsMobileMenuOpen }) => {
  const { usuario } = useAuth();

  const perfisMap = {
    ADM_FULL: "Administrador",
    ADM_VENDAS: "Gerente de Vendas",
    VENDEDOR: "Vendedor",
  };

  const nomePerfil = perfisMap[usuario?.perfil] || "Usuário";

  return (
    <header className="bg-brand-blue shadow-sm p-2 flex justify-between items-center md:hidden z-10">
      {/* Botão de menu hambúrguer */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="text-white p-2" //
        aria-label="Abrir menu"
      >
        <FiMenu size={28} />
      </button>

      <div className="text-right">
        <span className="font-semibold text-white">{usuario?.nome}</span>
        <p className="text-xs text-gray-200 -mt-1">{nomePerfil}</p>
      </div>
    </header>
  );
};

export default Header;
