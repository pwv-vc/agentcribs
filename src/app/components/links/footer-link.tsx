import type { ReactNode } from "react";

interface FooterLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function FooterLink({ href, children, className = "" }: FooterLinkProps) {
  return (
    <a
      href={href}
      className={`text-sm text-text-secondary no-underline underline-offset-2 transition-colors hover:text-text hover:underline ${className}`}
    >
      {children}
    </a>
  );
}
