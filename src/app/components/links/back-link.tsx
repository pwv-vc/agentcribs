import type { ReactNode } from "react";

interface BackLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function BackLink({ href, children, className = "" }: BackLinkProps) {
  return (
    <a
      href={href}
      className={`text-sm text-text-secondary underline decoration-border underline-offset-4 hover:text-pwv-deep-green dark:hover:text-pwv-green-hover transition-colors ${className}`}
    >
      {children}
    </a>
  );
}
