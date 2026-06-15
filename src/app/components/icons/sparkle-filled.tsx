export function SparkleFilledIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      className={className}
    >
      <path d="M12 1l2.5 5.5L20 9l-5.5 2.5L12 17l-2.5-5.5L4 9l5.5-2.5z" />
      <path d="M18 14l1.5 3.5L23 19l-3.5 1.5L18 24l-1.5-3.5L13 19l3.5-1.5z" />
      <path d="M5 15l1 2.5L8.5 18.5 6 19.5 5 22l-1-2.5L1.5 18.5 4 17.5z" />
    </svg>
  );
}
