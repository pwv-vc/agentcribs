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
      className={`block w-full rounded-none border border-brand-green bg-brand-green px-6 py-3 text-center text-base font-black text-accent-text no-underline transition-colors hover:border-brand-green-hover hover:bg-brand-green-hover sm:inline-block sm:w-auto sm:px-8 sm:py-4 sm:text-lg ${className}`}
    >
      {label}
    </a>
  );
}
