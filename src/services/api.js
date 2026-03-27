import axios from "axios";
import {
  obterAccessToken,
  refreshToken,
  logoutUsuario,
} from "./authService";

const API_URL = "https://gestao.nwayami.com/api/";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================
// REQUEST INTERCEPTOR
// ============================

api.interceptors.request.use((config) => {
  const token = obterAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ============================
// RESPONSE INTERCEPTOR (REFRESH)
// ============================

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔁 Tenta refresh automático
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccess = await refreshToken();

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return api(originalRequest);
      } catch (err) {
        logoutUsuario();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);