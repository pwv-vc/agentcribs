"use client";

import { useTransition } from "react";
import type { ApplicationData, ApplicationStatus } from "@/app/actions/application";
import { setApplicationStatus } from "@/app/actions/application";
import { StatusBadge } from "@/app/shared/status-badge";

function ReviewActions({ application }: { application: ApplicationData }) {
  const [isPending, startTransition] = useTransition();

  const updateStatus = (status: ApplicationStatus) => {
    startTransition(async () => {
      await setApplicationStatus(application.id, status);
    });
  };

  return (
    <div className="flex items-center gap-3">
      {application.status === "pending" && (
        <>
          <button
            onClick={() => updateStatus("accepted")}
            disabled={isPending}
            className="rounded-lg bg-status-accepted-text px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-status-accepted-text/80 disabled:opacity-50"
          >
            Accept
          </button>
          <button
            onClick={() => updateStatus("rejected")}
            disabled={isPending}
            className="rounded-lg bg-status-rejected-text px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-status-rejected-text/80 disabled:opacity-50"
          >
            Reject
          </button>
        </>
      )}
      {application.status === "accepted" && (
        <button
          onClick={() => updateStatus("rejected")}
          disabled={isPending}
          className="rounded-lg bg-status-rejected-text px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-status-rejected-text/80 disabled:opacity-50"
        >
          Move to rejected
        </button>
      )}
      {application.status === "rejected" && (
        <button
          onClick={() => updateStatus("accepted")}
          disabled={isPending}
          className="rounded-lg bg-status-accepted-text px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-status-accepted-text/80 disabled:opacity-50"
        >
          Move to accepted
        </button>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ApplicationDetail({ application }: { application: ApplicationData }) {
  const formatTopics = (topics: string[]) => {
    if (topics.length === 0) return "\u2014";
    return topics.join(", ");
  };

  return (
    <div className="space-y-6 rounded-lg border border-border bg-bg-soft p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight">
            {application.firstName} {application.lastName}
          </h2>
          <p className="mt-1 text-sm text-text-secondary">{application.email}</p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <dl className="divide-y divide-border">
        {application.githubHandle && (
          <div className="flex gap-4 py-3">
            <dt className="w-32 shrink-0 text-sm font-medium text-text-secondary">
              GitHub
            </dt>
            <dd className="space-y-1 text-sm">
              <a
                href={`https://github.com/${application.githubHandle}`}
                className="font-medium text-accent no-underline hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                @{application.githubHandle}
              </a>
              {application.githubProfile && (
                <div className="mt-2 space-y-1 text-text-secondary">
                  {application.githubProfile.name && (
                    <p>Name: {application.githubProfile.name as string}</p>
                  )}
                  {application.githubProfile.company && (
                    <p>Company: {application.githubProfile.company as string}</p>
                  )}
                  {application.githubProfile.location && (
                    <p>Location: {application.githubProfile.location as string}</p>
                  )}
                  {application.githubProfile.blog && (
                    <p>
                      Blog:{" "}
                      <a
                        href={application.githubProfile.blog as string}
                        className="text-accent no-underline hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {application.githubProfile.blog as string}
                      </a>
                    </p>
                  )}
                  {application.githubProfile.bio && (
                    <p className="italic">
                      {application.githubProfile.bio as string}
                    </p>
                  )}
                  {application.githubProfile.twitter_username && (
                    <p>
                      Twitter: @
                      {application.githubProfile.twitter_username as string}
                    </p>
                  )}
                  <p className="pt-1 text-xs text-text-secondary/60">
                    {application.githubProfile.public_repos as number} public repos &middot;{" "}
                    {application.githubProfile.followers as number} followers &middot;{" "}
                    GitHub since{" "}
                    {new Date(
                      application.githubProfile.created_at as string,
                    ).getFullYear()}
                  </p>
                </div>
              )}
            </dd>
          </div>
        )}
        <div className="flex gap-4 py-3">
          <dt className="w-32 text-sm font-medium text-text-secondary">Organization</dt>
          <dd className="text-sm">{application.organization || "\u2014"}</dd>
        </div>
        <div className="flex gap-4 py-3">
          <dt className="w-32 text-sm font-medium text-text-secondary">Topics</dt>
          <dd className="text-sm">{formatTopics(application.topics)}</dd>
        </div>
        {application.otherTopic && (
          <div className="flex gap-4 py-3">
            <dt className="w-32 text-sm font-medium text-text-secondary">Notes</dt>
            <dd className="text-sm">{application.otherTopic}</dd>
          </div>
        )}
        <div className="flex gap-4 py-3">
          <dt className="w-32 text-sm font-medium text-text-secondary">Applied</dt>
          <dd className="text-sm">{formatDate(application.createdAt)}</dd>
        </div>
        {application.editedAt && (
          <div className="flex gap-4 py-3">
            <dt className="w-32 text-sm font-medium text-text-secondary">Edited</dt>
            <dd className="text-sm">{formatDate(application.editedAt)}</dd>
          </div>
        )}
        {application.approvedAt && (
          <div className="flex gap-4 py-3">
            <dt className="w-32 text-sm font-medium text-text-secondary">Approved</dt>
            <dd className="text-sm">{formatDate(application.approvedAt)}</dd>
          </div>
        )}
        {application.rejectedAt && (
          <div className="flex gap-4 py-3">
            <dt className="w-32 text-sm font-medium text-text-secondary">Rejected</dt>
            <dd className="text-sm">{formatDate(application.rejectedAt)}</dd>
          </div>
        )}
      </dl>

      <div className="border-t border-border pt-4">
        <p className="mb-3 text-sm font-medium text-text-secondary">Review</p>
        <ReviewActions application={application} />
      </div>
    </div>
  );
}
