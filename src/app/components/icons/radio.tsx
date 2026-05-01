export function RadioIcon({ className }: { className?: string }) {
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
      <path d="M4.9 16.1C1 12.2 1 5.8 4.9 1.9" />
      <path d="M7.8 13.2c-2.3-2.3-2.3-6.1 0-8.5" />
      <circle cx="12" cy="10" r="3" />
      <circle cx="12" cy="10" r="7" />
      <circle cx="12" cy="10" r="10" />
    </svg>
  );
}
