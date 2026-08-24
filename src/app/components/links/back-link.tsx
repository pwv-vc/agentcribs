import type { ReactNode } from "react";

interface BackLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  /** Use when the link sits on a dark background. */
  onDark?: boolean;
}

export function BackLink({
  href,
  children,
  className = "",
  onDark = false,
}: BackLinkProps) {
  const variantClasses = onDark
    ? "text-pwv-white/70 underline decoration-pwv-white/30 hover:text-pwv-green hover:decoration-pwv-green"
    : "text-text-secondary decoration-border hover:text-pwv-deep-green dark:hover:text-pwv-green-hover";

  return (
    <a
      href={href}
      className={`text-sm underline underline-offset-4 transition-colors ${variantClasses} ${className}`}
    >
      {children}
    </a>
  );
}
