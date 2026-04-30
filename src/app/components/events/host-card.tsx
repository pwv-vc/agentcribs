import type { Host } from "@/app/lib/luma";

export function HostCard({ host }: { host: Host }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-bg-soft p-4">
      {host.avatar_url && (
        <img
          src={host.avatar_url}
          alt={host.name}
          className="size-12 rounded-full object-cover"
        />
      )}
      <div>
        <p className="font-medium text-text">{host.name}</p>
        {host.username && (
          <p className="text-sm text-text-secondary">@{host.username}</p>
        )}
        {host.bio && <p className="mt-1 text-sm text-text-secondary">{host.bio}</p>}
      </div>
    </div>
  );
}
