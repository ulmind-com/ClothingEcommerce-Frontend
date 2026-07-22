import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import authEditorial from "@/assets/atelier-new-7.jpeg.asset.json";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Split editorial layout for the auth screens.
 *
 * The panel image is a bundled campaign still rather than an admin banner:
 * banners carry promotional artwork (sale creatives, third-party campaigns)
 * that reads wrong behind a sign-in form.
 */
export function AuthLayout({
  eyebrow,
  title,
  intro,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* Editorial panel */}
      <aside className="relative hidden overflow-hidden bg-ink lg:block">
        {/* Only the scale is animated — fading opacity in from 0 left the
            panel near-black whenever a re-render restarted the transition. */}
        <motion.img
          src={authEditorial.url}
          alt=""
          aria-hidden
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: EASE }}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        {/* This still is already dark and moody, so it needs far less scrim
            than a bright promo image would — just enough under the copy. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-ink/20" />

        <div className="relative flex h-full flex-col justify-between p-14">
          <Link
            to="/"
            className="font-display text-2xl uppercase tracking-[0.4em] text-cream"
          >
            Maison
          </Link>

          {/* Deliberately not animated in: the panel is hidden below lg, and a
              mount that happens while it's display:none leaves an opacity-0
              entry animation stranded — the copy simply never appears. */}
          <div className="max-w-md">
            <p className="font-display text-4xl leading-[1.15] text-cream drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
              Pieces made in small numbers, kept for a long time.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-cream/70 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
              An account keeps your orders, saved pieces and delivery details in
              one place.
            </p>
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col justify-center bg-cream px-6 py-20 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-[420px]">
          <Link
            to="/"
            className="font-display text-xl uppercase tracking-[0.4em] text-ink lg:hidden"
          >
            Maison
          </Link>

          {/* Slides but never fades: this wraps the sign-in form itself, and a
              stranded opacity-0 would hide the whole thing. */}
          <motion.div
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mt-10 lg:mt-0"
          >
            <div className="eyebrow mb-4">{eyebrow}</div>
            <h1 className="font-display text-[2.75rem] leading-[1.05] text-ink">
              {title}
            </h1>
            {intro && (
              <p className="mt-4 text-sm leading-relaxed text-warm-gray">
                {intro}
              </p>
            )}

            <div className="mt-10">{children}</div>

            {footer && (
              <div className="mt-10 border-t border-border pt-6 text-sm text-warm-gray">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

/** Underlined field that fills on focus — used across the auth screens. */
export function LuxField({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
  maxLength,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  maxLength?: number;
  placeholder?: string;
}) {
  return (
    <label className="group block">
      <span className="eyebrow text-[0.65rem] text-warm-gray transition-colors group-focus-within:text-ink">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        placeholder={placeholder}
        className="mt-2 min-h-11 w-full border-b border-border bg-transparent pb-3.5 pt-1.5 text-base text-ink outline-none transition-colors placeholder:text-warm-gray/40 focus:border-ink md:text-[0.95rem]"
      />
    </label>
  );
}

/** Primary action with a wipe-fill hover. */
export function LuxButton({
  children,
  disabled,
  type = "submit",
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  type?: "submit" | "button";
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="group relative w-full overflow-hidden bg-ink py-4 disabled:opacity-40"
    >
      <span className="absolute inset-0 -translate-x-full bg-champagne transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-disabled:translate-x-full" />
      <span className="eyebrow relative text-cream transition-colors duration-500 group-hover:text-ink">
        {children}
      </span>
    </button>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="h-px flex-1 bg-border" />
      <span className="eyebrow text-[0.6rem] text-warm-gray">{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
