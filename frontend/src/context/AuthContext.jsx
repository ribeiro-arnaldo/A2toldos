import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUsuario(decodedUser);
        api.defaults.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Token inválido ou expirado.", error);
        localStorage.removeItem("authToken");
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem("authToken", token);
    const decodedUser = jwtDecode(token);
    setUsuario(decodedUser);
    api.defaults.headers.Authorization = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUsuario(null);
    delete api.defaults.headers.Authorization;
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
