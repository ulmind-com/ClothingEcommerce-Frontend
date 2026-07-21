import { Link, type LinkProps } from "@tanstack/react-router";
import type { ReactNode, ButtonHTMLAttributes } from "react";
import { Magnetic } from "./Magnetic";
import { cn } from "@/lib/utils/format";

const base =
  "group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-[0.72rem] uppercase tracking-[0.3em] font-medium transition-colors duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50";

const variants = {
  solid: "bg-ink text-cream hover:bg-champagne hover:text-ink",
  outline: "border border-ink/70 text-ink hover:bg-ink hover:text-cream",
  ghost: "text-ink hover:text-champagne",
} as const;

type Variant = keyof typeof variants;

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  magnetic?: boolean;
}

export function LuxButton({
  variant = "solid",
  className,
  children,
  magnetic = true,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const btn = (
    <button className={cn(base, variants[variant], className)} {...rest}>
      <span>{children}</span>
    </button>
  );
  return magnetic ? <Magnetic strength={0.2}>{btn}</Magnetic> : btn;
}

type LuxLinkProps = CommonProps & Omit<LinkProps, "children" | "className">;

export function LuxLink({
  variant = "solid",
  className,
  children,
  magnetic = true,
  ...rest
}: LuxLinkProps) {
  const el = (
    <Link className={cn(base, variants[variant], className)} {...rest}>
      <span>{children}</span>
    </Link>
  );
  return magnetic ? <Magnetic strength={0.2}>{el}</Magnetic> : el;
}