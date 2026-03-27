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
// LOGOUT
// ============================

export const logoutUsuario = async () => {
  try {
    const refresh = obterRefreshToken();

    if (refresh) {
      await api.post("auth/token/logout/", {
        refresh,
      });
    }
  } catch (error) {
    console.log("Erro ao fazer logout:", error);
  } finally {
    removerTokens();
  }
};

// ============================
// USUÁRIO LOGADO
// (ajusta conforme tua API)
// ============================

export const obterUsuario = async () => {
  const token = obterAccessToken();

  const response = await api.get("auth/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
