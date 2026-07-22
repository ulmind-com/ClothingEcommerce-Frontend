import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  AuthLayout,
  Divider,
  LuxButton,
  LuxField,
} from "@/components/auth/AuthLayout";
import { GoogleSignIn } from "@/components/auth/GoogleSignIn";
import { login } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth/store";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: LoginPage,
});

function LoginPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const signIn = useAuth((s) => s.signIn);
  const token = useAuth((s) => s.token);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Already signed in — nothing to do on this page.
  useEffect(() => {
    if (token) navigate({ to: redirect ?? "/account", replace: true });
  }, [token, redirect, navigate]);

  const mutation = useMutation({
    mutationFn: () => login(email.trim(), password),
    onSuccess: (res) => {
      signIn(res.access_token, res.user);
      toast.success(`Welcome back, ${res.user.name ?? ""}`.trim());
      navigate({ to: redirect ?? "/account", replace: true });
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Could not sign in"),
  });

  return (
    <AuthLayout
      eyebrow="Account"
      title="Sign in"
      intro="Your orders, saved pieces and delivery details, kept together."
      footer={
        <>
          New to Maison?{" "}
          <Link
            to="/signup"
            className="text-ink underline decoration-champagne decoration-2 underline-offset-4 transition-colors hover:text-champagne"
          >
            Create an account
          </Link>
        </>
      }
    >
      <div className="space-y-8">
        <GoogleSignIn redirect={redirect} />

        <Divider label="or with email" />

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.trim() || !password) {
              toast.error("Email and password are required");
              return;
            }
            mutation.mutate();
          }}
        >
          <LuxField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            placeholder="you@example.com"
          />
          <LuxField
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            placeholder="••••••••"
          />
          <div className="pt-2">
            <LuxButton disabled={mutation.isPending}>
              {mutation.isPending ? "Signing in…" : "Sign in"}
            </LuxButton>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}

/**
 * Kept for the checkout address form, which reuses this input styling.
 * @deprecated prefer LuxField from AuthLayout for new surfaces.
 */
export function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  maxLength?: number;
}) {
  return (
    <LuxField
      label={label}
      value={value}
      onChange={onChange}
      type={type}
      autoComplete={autoComplete}
      inputMode={inputMode}
      maxLength={maxLength}
    />
  );
}
