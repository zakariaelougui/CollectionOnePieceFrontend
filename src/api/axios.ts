import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/auth.store";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

const api = axios.create({ baseURL: BASE_URL });

// Single-flight refresh mutex
let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original: AxiosRequestConfig & { _retry?: boolean } = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // Don't retry auth endpoints to avoid infinite loops
    if (original.url?.includes("/auth/")) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      if (!refreshPromise) {
        const { refreshToken } = useAuthStore.getState();
        if (!refreshToken) throw new Error("no refresh token");
        refreshPromise = api
          .post<{ accessToken: string }>("/auth/refresh", { refreshToken })
          .then((res) => res.data.accessToken)
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;
      useAuthStore.getState().setAccessToken(newAccessToken);

      if (original.headers) {
        original.headers["Authorization"] = `Bearer ${newAccessToken}`;
      }
      return api(original);
    } catch {
      await useAuthStore.getState().logout();
      return Promise.reject(error);
    }
  },
);

export default api;
