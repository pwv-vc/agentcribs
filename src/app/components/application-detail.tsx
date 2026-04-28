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
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
          >
            Accept
          </button>
          <button
            onClick={() => updateStatus("rejected")}
            disabled={isPending}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            Reject
          </button>
        </>
      )}
      {application.status === "accepted" && (
        <button
          onClick={() => updateStatus("rejected")}
          disabled={isPending}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          Move to rejected
        </button>
      )}
      {application.status === "rejected" && (
        <button
          onClick={() => updateStatus("accepted")}
          disabled={isPending}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {application.firstName} {application.lastName}
          </h2>
          <p className="mt-1 text-sm text-text-secondary">{application.email}</p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <dl className="divide-y divide-border">
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
