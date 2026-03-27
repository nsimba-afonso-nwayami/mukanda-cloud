import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUsuario,
  obterUsuario,
  logoutUsuario,
  obterAccessToken,
} from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================
  // CARREGAR USUÁRIO
  // ============================
  useEffect(() => {
    async function carregarUsuario() {
      const token = obterAccessToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await obterUsuario();
        setUser(data);
      } catch (error) {
        logoutUsuario();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    carregarUsuario();
  }, []);

  // ============================
  // LOGIN
  // ============================
  async function login(credentials) {
    try {
      await loginUsuario(credentials);

      const data = await obterUsuario();
      setUser(data);

      return { success: true, user: data };
    } catch (error) {
      return { success: false, error };
    }
  }

  // ============================
  // LOGOUT
  // ============================
  function logout() {
    logoutUsuario();
    setUser(null);
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}