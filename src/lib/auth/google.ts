/**
 * Google Identity Services loader.
 *
 * GIS hands back a signed ID token (a JWT in `credential`); the backend
 * verifies it against the same client id in POST /auth/google. The token never
 * touches our code beyond forwarding it — no password or Google session data
 * is read here.
 */

const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

export const GOOGLE_CLIENT_ID =
  (import.meta as ImportMeta & { env: { VITE_GOOGLE_CLIENT_ID?: string } }).env
    .VITE_GOOGLE_CLIENT_ID ?? "";

export interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
}

export interface GoogleButtonOptions {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "small" | "medium" | "large";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  width?: number;
}

interface GoogleIdApi {
  initialize: (config: {
    client_id: string;
    callback: (res: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    use_fedcm_for_prompt?: boolean;
  }) => void;
  renderButton: (parent: HTMLElement, options: GoogleButtonOptions) => void;
  prompt: () => void;
  disableAutoSelect: () => void;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleIdApi } };
  }
}

let loading: Promise<GoogleIdApi | null> | null = null;

export function loadGoogleIdentity(): Promise<GoogleIdApi | null> {
  if (typeof window === "undefined" || !GOOGLE_CLIENT_ID) {
    return Promise.resolve(null);
  }
  if (window.google?.accounts?.id) {
    return Promise.resolve(window.google.accounts.id);
  }
  if (loading) return loading;

  loading = new Promise<GoogleIdApi | null>((resolve) => {
    const done = () => resolve(window.google?.accounts?.id ?? null);
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", done);
      existing.addEventListener("error", () => resolve(null));
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = done;
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  }).finally(() => {
    loading = null;
  });

  return loading;
}
