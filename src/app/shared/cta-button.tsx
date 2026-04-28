export function CtaButton({
  href = "/apply",
  label = "Apply to join AgentCribs",
  className = "",
}: {
  href?: string;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`block w-full rounded-lg bg-accent px-6 py-3 text-center text-base font-bold text-accent-text no-underline transition-colors hover:bg-accent-hover sm:inline-block sm:w-auto sm:px-8 sm:py-4 sm:text-lg ${className}`}
    >
      {label}
    </a>
  );
}
