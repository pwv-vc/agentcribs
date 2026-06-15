import type { ReactNode } from "react";

interface BrandLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}

export function BrandLink({
  href,
  children,
  className = "",
  external = false,
}: BrandLinkProps) {
  return (
    <a
      href={href}
      className={`font-bold text-pwv-green no-underline hover:text-pwv-deep-green dark:hover:text-pwv-green-hover ${className}`}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
    </a>
  );
}
