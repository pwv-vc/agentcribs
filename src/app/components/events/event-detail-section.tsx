import { ReactNode } from "react";

export function EventDetailSection({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3">
      <dt className="w-32 shrink-0 text-xs sm:text-sm font-medium text-text-secondary">
        {label}
      </dt>
      <dd className="text-sm text-text">{value ?? "-"}</dd>
    </div>
  );
}
