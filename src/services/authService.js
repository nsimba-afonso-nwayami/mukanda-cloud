import { api } from "./api";

// ============================
// TOKENS
// ============================

export const salvarTokens = (data) => {
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);
};

export const obterAccessToken = () => {
  return localStorage.getItem("access");
};

export const obterRefreshToken = () => {
  return localStorage.getItem("refresh");
};

export const removerTokens = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

// ============================
// LOGIN
// ============================

export const loginUsuario = async (credentials) => {
  const response = await api.post("auth/token/", credentials);

  salvarTokens(response.data);

  return response.data;
};

// ============================
// REFRESH TOKEN
// ============================

export const refreshToken = async () => {
  const refresh = obterRefreshToken();

  if (!refresh) throw new Error("Sem refresh token");

  const response = await api.post("auth/token/refresh/", {
    refresh,
  });

  localStorage.setItem("access", response.data.access);

  return response.data.access;
};

// ============================
// LOGOUT
// ============================

export const logoutUsuario = async () => {
  try {
    const refresh = obterRefreshToken();

    if (refresh) {
      await api.post("auth/token/logout/", { refresh });
    }
  } catch (error) {
    console.log("Erro logout:", error);
  } finally {
    removerTokens();
  }
};