import { getDashboardStats } from "@/app/queries/dashboard";
import { Seo } from "@/app/components/seo";
import { HowHeardAnalysis } from "@/app/components/admin/how-heard-analysis";
import { StoryThemes } from "@/app/components/admin/story-themes";
import {
  CheckCircleIcon,
  ClockIcon,
  FileTextIcon,
  FlagIcon,
  QuestionIcon,
  UsersIcon,
  XCircleIcon,
} from "@/app/components/icons";

const TOP_N = 10;

export const AdminDashboard = async () => {
  const stats = await getDashboardStats();

  const metrics = [
    {
      label: "Total",
      value: stats.total,
      icon: UsersIcon,
      color: "text-text",
      bg: "bg-bg-muted",
    },
    {
      label: "Accepted",
      value: stats.statusCounts.accepted,
      icon: CheckCircleIcon,
      color: "text-status-accepted-text",
      bg: "bg-status-accepted-bg",
    },
    {
      label: "Pending",
      value: stats.statusCounts.pending,
      icon: ClockIcon,
      color: "text-status-pending-text",
      bg: "bg-status-pending-bg",
    },
    {
      label: "Rejected",
      value: stats.statusCounts.rejected,
      icon: XCircleIcon,
      color: "text-status-rejected-text",
      bg: "bg-status-rejected-bg",
    },
    {
      label: "Unverified",
      value: stats.statusCounts.unverified,
      icon: QuestionIcon,
      color: "text-status-unverified-text",
      bg: "bg-status-unverified-bg",
    },
  ];

  const acceptanceRate =
    stats.total > 0
      ? Math.round((stats.statusCounts.accepted / stats.total) * 100)
      : 0;

  return (
    <>
      <Seo
        title="Dashboard | Admin | AgentCribs"
        description="AgentCribs application dashboard with metrics and AI-powered analysis."
        noIndex
      />
      <main className="mx-auto max-w-[1200px] px-6 py-16 sm:px-8 sm:py-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl leading-snug">
            Dashboard
          </h1>
          <span className="text-sm text-text-secondary">
            {acceptanceRate}% acceptance rate
          </span>
        </div>

        {/* Metrics cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 mb-10">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className={`rounded-xl border border-border shadow-sm ${m.bg} p-5`}
              >
                <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-text-secondary mb-2">
                  <Icon />
                  {m.label}
                </p>
                <p className={`text-3xl font-bold ${m.color}`}>{m.value}</p>
              </div>
            );
          })}
        </div>

        {/* Leaderboards row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Topics Leaderboard */}
          <div className="rounded-xl border border-border bg-bg p-6">
            <div className="flex items-center gap-2 mb-5">
              <FlagIcon />
              <h2 className="font-serif text-xl font-bold tracking-tight">
                Top Topics
              </h2>
            </div>
            {stats.topicCounts.length === 0 ? (
              <p className="text-sm text-text-secondary">No topics yet.</p>
            ) : (
              <div className="space-y-1">
                {stats.topicCounts.slice(0, TOP_N).map((t, i) => (
                  <div
                    key={t.topic}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-bg-muted"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-mono text-text-secondary w-5 shrink-0">
                        {i + 1}.
                      </span>
                      <span className="text-sm text-text truncate">
                        {t.topic}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="h-2 w-24 rounded-full bg-bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent/70 dark:bg-accent"
                          style={{
                            width: `${Math.round((t.count / stats.topicCounts[0].count) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-text-secondary w-8 text-right tabular-nums">
                        {t.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Locations Leaderboard */}
          <div className="rounded-xl border border-border bg-bg p-6">
            <div className="flex items-center gap-2 mb-5">
              <FileTextIcon />
              <h2 className="font-serif text-xl font-bold tracking-tight">
                Top Locations
              </h2>
            </div>
            {stats.locationCounts.length === 0 ? (
              <p className="text-sm text-text-secondary">
                No location data yet.
              </p>
            ) : (
              <div className="space-y-1">
                {stats.locationCounts.slice(0, TOP_N).map((l, i) => (
                  <div
                    key={l.location}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-bg-muted"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-mono text-text-secondary w-5 shrink-0">
                        {i + 1}.
                      </span>
                      <span className="text-sm text-text truncate">
                        {l.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="h-2 w-24 rounded-full bg-bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent/70 dark:bg-accent"
                          style={{
                            width: `${Math.round((l.count / stats.locationCounts[0].count) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-text-secondary w-8 text-right tabular-nums">
                        {l.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Analysis sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HowHeardAnalysis entries={stats.rawHowHeard} />
          <StoryThemes stories={stats.rawStories} />
        </div>
      </main>
    </>
  );
};
