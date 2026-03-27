import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUsuario,
  logoutUsuario,
  obterAccessToken,
} from "../services/authService";

import { api } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================
  // INIT (carrega user via API)
  // ============================
  useEffect(() => {
    const token = obterAccessToken();

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("auth/")
      .then((res) => setUser(res.data))
      .catch(() => {
        logoutUsuario();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ============================
  // LOGIN (SEM REDIRECT AQUI)
  // ============================
  async function login(credentials) {
    try {
      const data = await loginUsuario(credentials);

      setUser(data.user);

      return { success: true, user: data.user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Credenciais inválidas",
      };
    }
  }

  // ============================
  // LOGOUT
  // ============================
  function logout() {
    logoutUsuario();
    setUser(null);
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}