import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "white" | "outline-dark";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-sans text-sm font-medium tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-teal text-white shadow-[0_10px_30px_-12px_rgba(28,74,92,0.55)] hover:bg-dark-navy hover:shadow-[0_16px_40px_-12px_rgba(3,53,75,0.6)] hover:-translate-y-0.5",
  secondary:
    "border border-teal-200 bg-white/70 text-teal-800 backdrop-blur-sm hover:border-teal-400 hover:bg-white hover:-translate-y-0.5",
  ghost: "text-teal-700 hover:bg-teal-50",
  white:
    "bg-white text-teal-800 shadow-[0_10px_30px_-12px_rgba(3,53,75,0.4)] hover:bg-teal-50 hover:-translate-y-0.5",
  "outline-dark":
    "border border-white/30 text-white hover:bg-white/10 hover:-translate-y-0.5",
};

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: keyof typeof sizes;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </Link>
  );
}

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-slate-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-teal-700",
        className
      )}
    >
      {children}
    </span>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.24em] text-slate-accent">
      {children}
    </p>
  );
}

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10", className)}>
      {children}
    </div>
  );
}
