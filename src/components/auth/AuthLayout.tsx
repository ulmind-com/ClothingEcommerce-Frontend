import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { bannersOptions } from "@/lib/api/queries";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Split editorial layout for the auth screens. The campaign image is whatever
 * banner the admin has pinned first, so the sign-in page moves with the rest
 * of the storefront instead of holding a hardcoded asset.
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
  const { data: banners = [] } = useQuery(bannersOptions());
  const hero = banners.find((b) => b.image)?.image;

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* Editorial panel */}
      <aside className="relative hidden overflow-hidden bg-ink lg:block">
        {hero && (
          <motion.img
            src={hero}
            alt=""
            aria-hidden
            initial={{ scale: 1.12, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.85 }}
            transition={{ duration: 2.4, ease: EASE }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {/* Enough scrim for the copy to stay legible, light enough that the
            campaign image still reads. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/25 to-ink/30" />

        <div className="relative flex h-full flex-col justify-between p-14">
          <Link
            to="/"
            className="font-display text-2xl uppercase tracking-[0.4em] text-cream"
          >
            Maison
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            className="max-w-md"
          >
            <p className="font-display text-4xl leading-[1.15] text-cream">
              Pieces made in small numbers, kept for a long time.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-cream/60">
              An account keeps your orders, saved pieces and delivery details in
              one place.
            </p>
          </motion.div>
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

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
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
        className="mt-2 w-full border-b border-border bg-transparent pb-3 pt-1 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-warm-gray/40 focus:border-ink"
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
