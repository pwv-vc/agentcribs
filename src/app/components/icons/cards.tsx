export function CardsIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M13 16a4 4 0 0 0-8 0" />
      <path d="M14 8h4" />
      <path d="M14 12h4" />
    </svg>
  );
}
