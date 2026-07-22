import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";
import { useAuth } from "@/lib/auth/store";

/**
 * Gate for account-only routes. Waits for `ready` (the store reads the token
 * from localStorage on mount, so SSR and the first client paint look signed
 * out) before bouncing anyone to /login.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const token = useAuth((s) => s.token);
  const ready = useAuth((s) => s.ready);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Pin the gated path on first render. Navigating to /login changes pathname,
  // which would otherwise re-fire this effect and overwrite redirect with
  // "/login" before the component unmounts.
  const target = useRef(pathname);

  useEffect(() => {
    if (ready && !token) {
      navigate({
        to: "/login",
        search: { redirect: target.current },
        replace: true,
      });
    }
  }, [ready, token, navigate]);

  if (!ready || !token) {
    return (
      <div className="grid min-h-screen place-items-center">
        <span className="eyebrow text-warm-gray">Loading…</span>
      </div>
    );
  }

  return <>{children}</>;
}
