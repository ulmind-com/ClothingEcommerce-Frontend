import axios, { AxiosError } from "axios";

export const API_BASE_URL =
  (import.meta as ImportMeta & { env: { VITE_API_BASE_URL?: string } }).env
    .VITE_API_BASE_URL ?? "https://clothingecommerce-backend.onrender.com";

export const TOKEN_KEY = "user_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* noop */
  }
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error: AxiosError<{ detail?: string; message?: string }>) => {
    if (error.response?.status === 401) {
      setToken(null);
    }
    const detail =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "Request failed";
    return Promise.reject(new Error(detail));
  },
);

export async function get<T>(url: string, params?: Record<string, unknown>) {
  const { data } = await api.get<T>(url, { params });
  return data;
}

export async function post<T>(url: string, body?: unknown) {
  const { data } = await api.post<T>(url, body);
  return data;
}

export async function del<T>(url: string) {
  const { data } = await api.delete<T>(url);
  return data;
}