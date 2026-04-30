export function EventDescription({
  description,
}: {
  description: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-bg-soft p-6 sm:p-8">
      <div className="prose prose-sm max-w-none dark:prose-invert">
        {description.split("\n").map((line, i) => (
          <p key={i}>{line || "\u00A0"}</p>
        ))}
      </div>
    </div>
  );
}
