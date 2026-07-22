import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { googleAuth } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth/store";
import {
  GOOGLE_CLIENT_ID,
  loadGoogleIdentity,
  type GoogleCredentialResponse,
} from "@/lib/auth/google";

/**
 * Renders Google's own account-chooser button — Google's branding guidelines
 * require their button, and it's the only surface that can open the account
 * picker. We size it to the form and let the surrounding layout carry the
 * Maison styling.
 */
export function GoogleSignIn({ redirect }: { redirect?: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const signIn = useAuth((s) => s.signIn);
  const [unavailable, setUnavailable] = useState(false);

  const exchange = useMutation({
    mutationFn: (idToken: string) => googleAuth(idToken),
    onSuccess: (res) => {
      signIn(res.access_token, res.user);
      toast.success(`Welcome, ${res.user.name ?? ""}`.trim());
      navigate({ to: redirect ?? "/account", replace: true });
    },
    onError: (err) =>
      toast.error(
        err instanceof Error ? err.message : "Google sign-in failed",
      ),
  });

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      setUnavailable(true);
      return;
    }
    let cancelled = false;

    loadGoogleIdentity().then((api) => {
      if (cancelled || !api || !holder.current) {
        if (!cancelled && !api) setUnavailable(true);
        return;
      }
      api.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (res: GoogleCredentialResponse) => {
          if (res.credential) exchange.mutate(res.credential);
        },
        // No auto sign-in: the customer picks an account deliberately.
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      api.renderButton(holder.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "center",
        width: holder.current.offsetWidth || 360,
      });
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (unavailable) return null;

  return (
    <div className="w-full">
      <div
        ref={holder}
        className="flex w-full justify-center [color-scheme:light]"
        aria-label="Continue with Google"
      />
      {exchange.isPending && (
        <p className="eyebrow mt-3 text-center text-warm-gray">
          Signing you in…
        </p>
      )}
    </div>
  );
}
