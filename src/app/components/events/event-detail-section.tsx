export function EventDetailSection({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-4 py-3">
      <dt className="w-32 shrink-0 text-sm font-medium text-text-secondary">
        {label}
      </dt>
      <dd className="text-sm text-text">{value || "-"}</dd>
    </div>
  );
}
