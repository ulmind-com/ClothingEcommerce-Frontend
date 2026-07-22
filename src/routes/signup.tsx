import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check } from "lucide-react";
import {
  AuthLayout,
  Divider,
  LuxButton,
  LuxField,
} from "@/components/auth/AuthLayout";
import { GoogleSignIn } from "@/components/auth/GoogleSignIn";
import { register, requestOtp, verifyOtp } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth/store";
import { cn } from "@/lib/utils/format";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

const STEPS = ["Email", "Verify", "Profile"] as const;
type Step = 0 | 1 | 2;

const EASE = [0.22, 1, 0.36, 1] as const;

function SignupPage() {
  const navigate = useNavigate();
  const signIn = useAuth((s) => s.signIn);

  const [step, setStep] = useState<Step>(0);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [signupToken, setSignupToken] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [resendIn, setResendIn] = useState(0);

  // The backend rate-limits resends; mirror its cooldown in the UI.
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const sendCode = useMutation({
    mutationFn: () => requestOtp(email.trim().toLowerCase()),
    onSuccess: (res) => {
      setStep(1);
      setResendIn(res.resend_in ?? 60);
      toast.success(res.message ?? "Code sent");
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Could not send code"),
  });

  const checkCode = useMutation({
    mutationFn: () => verifyOtp(email.trim().toLowerCase(), code.trim()),
    onSuccess: (res) => {
      setSignupToken(res.signup_token);
      setStep(2);
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Incorrect code"),
  });

  const createAccount = useMutation({
    mutationFn: () =>
      register({
        signup_token: signupToken,
        name: name.trim(),
        phone: phone.trim(),
        password,
      }),
    onSuccess: (res) => {
      signIn(res.access_token, res.user);
      toast.success("Welcome to Maison");
      navigate({ to: "/account", replace: true });
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Could not sign up"),
  });

  return (
    <AuthLayout
      eyebrow="New account"
      title="Join Maison"
      intro="Three short steps. We verify your email so your orders stay yours."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            search={{ redirect: undefined }}
            className="text-ink underline decoration-champagne decoration-2 underline-offset-4 transition-colors hover:text-champagne"
          >
            Sign in
          </Link>
        </>
      }
    >
      <div className="space-y-8">
        {step === 0 && (
          <>
            <GoogleSignIn />
            <Divider label="or with email" />
          </>
        )}

        <Stepper current={step} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {step === 0 && (
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!email.trim()) return toast.error("Email is required");
                  sendCode.mutate();
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
                <p className="text-xs leading-relaxed text-warm-gray">
                  We'll send a 6-digit code to confirm it's you.
                </p>
                <LuxButton disabled={sendCode.isPending}>
                  {sendCode.isPending ? "Sending…" : "Send code"}
                </LuxButton>
              </form>
            )}

            {step === 1 && (
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (code.trim().length !== 6)
                    return toast.error("Enter the 6-digit code");
                  checkCode.mutate();
                }}
              >
                <p className="text-sm text-warm-gray">
                  Code sent to <span className="text-ink">{email}</span>.
                </p>
                <CodeInput value={code} onChange={setCode} />
                <LuxButton disabled={checkCode.isPending}>
                  {checkCode.isPending ? "Verifying…" : "Verify email"}
                </LuxButton>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="eyebrow text-[0.6rem] text-warm-gray hover:text-ink"
                  >
                    ← Change email
                  </button>
                  <button
                    type="button"
                    disabled={resendIn > 0 || sendCode.isPending}
                    onClick={() => sendCode.mutate()}
                    className="eyebrow text-[0.6rem] text-warm-gray hover:text-ink disabled:opacity-50 disabled:hover:text-warm-gray"
                  >
                    {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!name.trim() || !phone.trim() || !password)
                    return toast.error("All fields are required");
                  createAccount.mutate();
                }}
              >
                <div className="flex items-center gap-2 text-xs text-warm-gray">
                  <Check className="h-3.5 w-3.5 text-champagne" />
                  {email} verified
                </div>
                <LuxField
                  label="Full name"
                  value={name}
                  onChange={setName}
                  autoComplete="name"
                />
                <LuxField
                  label="Phone"
                  value={phone}
                  onChange={setPhone}
                  inputMode="tel"
                  autoComplete="tel"
                />
                <LuxField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                />
                <LuxButton disabled={createAccount.isPending}>
                  {createAccount.isPending ? "Creating…" : "Create account"}
                </LuxButton>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
}

function Stepper({ current }: { current: Step }) {
  return (
    <ol className="flex items-center gap-3">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-3">
            <div className="flex-1">
              <div className="relative h-px w-full bg-border">
                <motion.span
                  initial={false}
                  animate={{ scaleX: done || active ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  style={{ originX: 0 }}
                  className="absolute inset-0 bg-ink"
                />
              </div>
              <span
                className={cn(
                  "eyebrow mt-3 block text-[0.6rem] transition-colors",
                  active ? "text-ink" : "text-warm-gray",
                )}
              >
                {label}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Six separate boxes that mirror one hidden input — keeps paste working. */
function CodeInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="eyebrow text-[0.65rem] text-warm-gray">
        Verification code
      </span>
      <div className="relative mt-3">
        <input
          value={value}
          onChange={(e) =>
            onChange(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
          aria-label="6-digit verification code"
        />
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex h-14 flex-1 items-center justify-center border text-lg text-ink transition-colors",
                value.length === i
                  ? "border-ink"
                  : value[i]
                    ? "border-ink/40"
                    : "border-border",
              )}
            >
              {value[i] ?? ""}
            </div>
          ))}
        </div>
      </div>
    </label>
  );
}
