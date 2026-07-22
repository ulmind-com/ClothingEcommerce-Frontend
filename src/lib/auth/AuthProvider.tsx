import { useQuery } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { meOptions } from "@/lib/api/queries";
import { useAuth } from "./store";

/**
 * Reads the persisted token on mount (SSR always renders signed out) and keeps
 * the store's user in sync with /auth/me. A dead token 401s, which the client
 * interceptor turns into a sign-out.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { token, ready, hydrate, setUser } = useAuth();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const { data } = useQuery(meOptions(ready && Boolean(token)));

  useEffect(() => {
    if (data) setUser(data);
  }, [data, setUser]);

  return <>{children}</>;
}
