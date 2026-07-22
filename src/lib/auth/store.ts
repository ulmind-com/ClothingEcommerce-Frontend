import { create } from "zustand";
import { getToken, setToken, setUnauthorizedHandler } from "@/lib/api/client";
import type { Me } from "@/types/api";

interface AuthState {
  /** Mirrors the localStorage token so components re-render on sign in/out. */
  token: string | null;
  user: Me | null;
  /** False until the client has read localStorage — SSR renders signed out. */
  ready: boolean;
  signIn: (token: string, user?: Me | null) => void;
  signOut: () => void;
  setUser: (user: Me | null) => void;
  hydrate: () => void;
}

export const useAuth = create<AuthState>()((set) => ({
  token: null,
  user: null,
  ready: false,
  signIn: (token, user = null) => {
    setToken(token);
    set({ token, user, ready: true });
  },
  signOut: () => {
    setToken(null);
    set({ token: null, user: null, ready: true });
  },
  setUser: (user) => set({ user }),
  hydrate: () => set({ token: getToken(), ready: true }),
}));

export const useIsSignedIn = () => useAuth((s) => Boolean(s.token));

// A 401 from any request means the token is dead — drop to signed out so the
// UI stops showing account-only surfaces.
setUnauthorizedHandler(() => {
  useAuth.setState({ token: null, user: null, ready: true });
});
