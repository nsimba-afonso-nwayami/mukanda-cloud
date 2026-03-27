import { api } from "./api";

// ============================
// TOKENS
// ============================

export const salvarTokens = (data) => {
  localStorage.setItem("accessToken", data.access);
  localStorage.setItem("refreshToken", data.refresh);

  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }
};

export const obterAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const obterRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const obterUsuarioLocal = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const removerTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

// ============================
// LOGIN
// ============================

export const loginUsuario = async (credentials) => {
  const response = await api.post("auth/token/", {
    email: credentials.email,
    password: credentials.password, // 🔥 CORRETO
  });

  salvarTokens(response.data);

  return response.data;
};

// ============================
// REFRESH TOKEN
// ============================

export const refreshToken = async () => {
  const refresh = obterRefreshToken();

  if (!refresh) return null;

  try {
    const response = await api.post("auth/token/refresh/", {
      refresh,
    });

    localStorage.setItem("accessToken", response.data.access);

    return response.data.access;
  } catch (error) {
    removerTokens();
    window.location.href = "/login";
    return null;
  }
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