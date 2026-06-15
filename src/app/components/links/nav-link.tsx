import type { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function NavLink({ href, children, className = "" }: NavLinkProps) {
  return (
    <a
      href={href}
      className={`text-sm font-medium text-text-secondary no-underline transition-colors hover:text-text ${className}`}
    >
      {children}
    </a>
  );
}
