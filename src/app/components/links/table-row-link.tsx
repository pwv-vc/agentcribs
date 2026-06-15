import type { ReactNode } from "react";

interface TableRowLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function TableRowLink({ href, children, className = "" }: TableRowLinkProps) {
  return (
    <a
      href={href}
      className={`font-medium text-text no-underline underline-offset-2 transition-colors hover:text-accent hover:underline ${className}`}
    >
      {children}
    </a>
  );
}
