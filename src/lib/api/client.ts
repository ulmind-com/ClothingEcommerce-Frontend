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

// The auth store registers here so a 401 anywhere can drop it back to signed
// out. Kept as a callback so client.ts stays free of store imports (the store
// imports this module).
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(fn: (() => void) | null) {
  onUnauthorized = fn;
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

/** A single entry of FastAPI's 422 validation payload. */
interface ValidationIssue {
  loc?: (string | number)[];
  msg?: string;
  type?: string;
}

/**
 * FastAPI sends `detail` as a string for raised HTTPExceptions but as an array
 * of issue objects for 422 validation errors. Stringifying the array directly
 * yields "[object Object]", so flatten it into readable text.
 */
function readDetail(detail: unknown): string | null {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const messages = (detail as ValidationIssue[])
      .map((issue) => {
        const field = issue.loc?.filter((p) => p !== "body").join(".");
        const msg = issue.msg ?? "is invalid";
        return field ? `${field}: ${msg}` : msg;
      })
      .filter(Boolean);
    if (messages.length) return messages.join("\n");
  }
  return null;
}

api.interceptors.response.use(
  (r) => r,
  (error: AxiosError<{ detail?: unknown; message?: string }>) => {
    if (error.response?.status === 401) {
      setToken(null);
      onUnauthorized?.();
    }
    const detail =
      readDetail(error.response?.data?.detail) ||
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

export async function patch<T>(url: string, body?: unknown) {
  const { data } = await api.patch<T>(url, body);
  return data;
}

export async function del<T>(url: string) {
  const { data } = await api.delete<T>(url);
  return data;
}