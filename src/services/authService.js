import { api } from "./api";

// ============================
// TOKENS
// ============================

export const salvarTokens = (data) => {
  localStorage.setItem("accessToken", data.access);
  localStorage.setItem("refreshToken", data.refresh);
};

export const obterAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const obterRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const removerTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
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

  localStorage.setItem("accessToken", response.data.access);

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