import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { loginUsuario, logoutUsuario, removerTokens } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem("access");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          removerTokens();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  async function login(credentials) {
    try {
      const data = await loginUsuario(credentials);
      // O data.user vem da sua API conforme vimos no log
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Credenciais inválidas",
      };
    }
  }

  function logout() {
    logoutUsuario();
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);