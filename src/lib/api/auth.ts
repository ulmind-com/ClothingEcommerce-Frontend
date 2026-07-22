import { get, patch, post } from "./client";
import type {
  AuthResponse,
  Me,
  OtpRequestResponse,
  OtpVerifyResponse,
} from "@/types/api";

/** POST /auth/login — email + password, returns a JWT. */
export const login = (email: string, password: string) =>
  post<AuthResponse>("/auth/login", { email, password });

/** Signup step 1 — emails a 6-digit code (429 if resent too soon). */
export const requestOtp = (email: string) =>
  post<OtpRequestResponse>("/auth/otp/request", { email });

/** Signup step 2 — exchanges the code for a short-lived signup token. */
export const verifyOtp = (email: string, code: string) =>
  post<OtpVerifyResponse>("/auth/otp/verify", { email, code });

/** Signup step 3 — consumes the signup token and creates the account. */
export const register = (body: {
  signup_token: string;
  name: string;
  phone: string;
  password: string;
}) => post<AuthResponse>("/auth/register", body);

/** POST /auth/google — verifies a Google ID token, upserts the user. */
export const googleAuth = (idToken: string) =>
  post<AuthResponse>("/auth/google", { id_token: idToken });

export const fetchMe = () => get<Me>("/auth/me");

export const updateMe = (body: {
  name?: string;
  phone?: string;
  avatar?: string;
}) => patch<Me>("/auth/me", body);
