import type { ReactNode } from "react";

type AccentVariant = "underlined" | "plain";

interface InlineAccentLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  variant?: AccentVariant;
}

export function InlineAccentLink({
  href,
  children,
  className = "",
  external = false,
  variant = "plain",
}: InlineAccentLinkProps) {
  const base =
    variant === "underlined"
      ? "text-accent underline decoration-border underline-offset-2 transition-colors hover:text-accent-hover"
      : "text-accent no-underline hover:underline";

  return (
    <a
      href={href}
      className={`${base} ${className}`}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
    </a>
  );
}
