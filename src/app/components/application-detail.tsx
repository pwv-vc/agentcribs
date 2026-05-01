"use client";

import { useState, useTransition } from "react";
import type {
  ApplicationData,
  ApplicationStatus,
} from "@/app/actions/application";
import {
  setApplicationStatus,
  resendVerificationEmail,
  resendNotificationEmail,
} from "@/app/actions/application";
import { StatusBadge } from "@/app/shared/status-badge";
import { link } from "@/app/shared/links";
import {
  MailIcon,
  SendIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  RotateCcwIcon,
  EditIcon,
  WarningIcon,
} from "@/app/components/icons";

type ResendTarget = "verification" | "notification" | null;

function ReviewActions({ application }: { application: ApplicationData }) {
  const [isPending, startTransition] = useTransition();
  const [confirm, setConfirm] = useState<ApplicationStatus | null>(null);
  const [resendConfirm, setResendConfirm] = useState<ResendTarget>(null);

  const updateStatus = (status: ApplicationStatus) => {
    setConfirm(status);
  };

  const confirmAction = () => {
    if (!confirm) return;
    startTransition(async () => {
      await setApplicationStatus(application.id, confirm);
      setConfirm(null);
    });
  };

  const cancelConfirm = () => {
    setConfirm(null);
    setResendConfirm(null);
  };

  const handleResend = (target: ResendTarget) => {
    setResendConfirm(target);
  };

  const confirmResend = () => {
    if (!resendConfirm) return;
    startTransition(async () => {
      if (resendConfirm === "verification") {
        await resendVerificationEmail(application.id);
      } else {
        await resendNotificationEmail(application.id);
      }
      setResendConfirm(null);
    });
  };

  const confirmMsg = () => {
    if (resendConfirm === "verification") {
      return "Resend the verification email to this applicant?";
    }
    if (resendConfirm === "notification") {
      if (application.status === "pending") {
        return "Resend the pending-review email to this applicant?";
      }
      if (application.status === "accepted") {
        return "Resend the welcome email to this applicant?";
      }
      return "Resend the rejection email to this applicant?";
    }
    if (confirm === "accepted") {
      return "Send welcome email and accept this applicant into AgentCribs?";
    }
    return "Send rejection notice? They can re-apply later with the same email.";
  };

  const confirmClass = () => {
    if (
      confirm === "accepted" ||
      (resendConfirm === "notification" && application.status === "accepted")
    ) {
      return "bg-status-accepted-text hover:bg-status-accepted-text/80";
    }
    if (resendConfirm === "verification" || resendConfirm === "notification") {
      return "bg-status-pending-text hover:bg-status-pending-text/80";
    }
    return "bg-status-rejected-text hover:bg-status-rejected-text/80";
  };

  const confirmButtonLabel = () => {
    if (resendConfirm) return isPending ? "Sending..." : "Yes, resend";
    return isPending
      ? "Sending..."
      : `Yes, ${confirm === "accepted" ? "accept" : "reject"}`;
  };

  return (
    <>
      {(confirm || resendConfirm) && (
        <div className="rounded-lg border border-border bg-bg p-4">
          <p className="mb-3 text-sm">{confirmMsg()}</p>
          <div className="flex gap-2">
            <button
              onClick={resendConfirm ? confirmResend : confirmAction}
              disabled={isPending}
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${confirmClass()}`}
            >
              {confirmButtonLabel()}
            </button>
            <button
              onClick={cancelConfirm}
              disabled={isPending}
              className="rounded-lg border border-border bg-bg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-soft disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {application.status === "unverified" && (
        <button
          onClick={() => handleResend("verification")}
          disabled={isPending || !!confirm || !!resendConfirm}
          className="inline-flex items-center gap-1.5 rounded-lg bg-status-pending-text px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-status-pending-text/80 disabled:opacity-50"
        >
          <MailIcon />
          Resend verification email
        </button>
      )}
      {application.status === "pending" && (
        <>
          <button
            onClick={() => handleResend("notification")}
            disabled={isPending || !!confirm || !!resendConfirm}
            className="inline-flex items-center gap-1.5 rounded-lg bg-status-pending-text px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-status-pending-text/80 disabled:opacity-50"
          >
            <ClockIcon />
            Resend pending review email
          </button>
          <button
            onClick={() => updateStatus("accepted")}
            disabled={isPending || !!confirm}
            className="inline-flex items-center gap-1.5 rounded-lg bg-status-accepted-text px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-status-accepted-text/80 disabled:opacity-50"
          >
            <CheckCircleIcon />
            Accept
          </button>
          <button
            onClick={() => updateStatus("rejected")}
            disabled={isPending || !!confirm}
            className="inline-flex items-center gap-1.5 rounded-lg bg-status-rejected-text px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-status-rejected-text/80 disabled:opacity-50"
          >
            <XCircleIcon />
            Reject
          </button>
        </>
      )}
      {application.status === "accepted" && (
        <>
          <button
            onClick={() => handleResend("notification")}
            disabled={isPending || !!confirm || !!resendConfirm}
            className="inline-flex items-center gap-1.5 rounded-lg bg-status-accepted-text px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-status-accepted-text/80 disabled:opacity-50"
          >
            <RotateCcwIcon />
            Resend accepted email
          </button>
          <button
            onClick={() => updateStatus("rejected")}
            disabled={isPending || !!confirm}
            className="inline-flex items-center gap-1.5 rounded-lg bg-status-rejected-text px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-status-rejected-text/80 disabled:opacity-50"
          >
            <XCircleIcon />
            Move to rejected
          </button>
        </>
      )}
      {application.status === "rejected" && (
        <>
          <button
            onClick={() => handleResend("notification")}
            disabled={isPending || !!confirm || !!resendConfirm}
            className="inline-flex items-center gap-1.5 rounded-lg bg-status-rejected-text px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-status-rejected-text/80 disabled:opacity-50"
          >
            <RotateCcwIcon />
            Resend rejection email
          </button>
          <button
            onClick={() => updateStatus("accepted")}
            disabled={isPending || !!confirm}
            className="inline-flex items-center gap-1.5 rounded-lg bg-status-accepted-text px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-status-accepted-text/80 disabled:opacity-50"
          >
            <CheckCircleIcon />
            Move to accepted
          </button>
        </>
      )}
    </>
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

export function ApplicationDetail({
  application,
}: {
  application: ApplicationData;
}) {
  const formatTopics = (topics: string[]) => {
    if (topics.length === 0) return "\u2014";
    return topics.join(", ");
  };

  return (
    <div className="space-y-6 rounded-lg border border-border bg-bg-soft p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold leading-snug">
            {application.firstName} {application.lastName}
          </h2>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <dl className="divide-y divide-border">
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3">
          <dt className="w-32 shrink-0 text-xs sm:text-sm font-medium text-text-secondary">
            Name
          </dt>
          <dd className="text-sm">
            {application.firstName} {application.lastName}
          </dd>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3">
          <dt className="w-32 shrink-0 text-xs sm:text-sm font-medium text-text-secondary">
            Email
          </dt>
          <dd className="text-sm">{application.email}</dd>
        </div>
        {application.githubHandle && (
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3">
            <dt className="w-32 shrink-0 text-xs sm:text-sm font-medium text-text-secondary">
              GitHub
            </dt>
            <dd className="text-sm">
              <a
                href={`https://github.com/${application.githubHandle}`}
                className="font-medium text-accent no-underline hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                @{application.githubHandle}
              </a>
              {application.githubEmailMismatch && (
                <p className="mt-3 mb-4 flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  <WarningIcon className="shrink-0" />
                  <span>GitHub email doesn&apos;t match application email</span>
                </p>
              )}
              {application.githubEmails &&
                application.githubEmails.length > 0 && (
                  <div className="mt-2 space-y-0.5">
                    <p className="text-xs font-medium text-text-secondary/70">
                      GitHub account emails
                    </p>
                    {application.githubEmails.map((e) => (
                      <p key={e.email} className="text-xs text-text-secondary">
                        {e.email}
                        {e.primary && (
                          <span className="ml-1.5 text-accent">primary</span>
                        )}
                        {e.verified && !e.primary && (
                          <span className="ml-1.5 text-status-accepted-text">
                            verified
                          </span>
                        )}
                        {!e.verified && (
                          <span className="inline-flex items-center gap-0.5 ml-1.5 text-amber-600">
                            <WarningIcon />
                            unverified
                          </span>
                        )}
                      </p>
                    ))}
                  </div>
                )}
              {application.githubProfile && (
                <div className="mt-2 space-y-1 text-text-secondary">
                  {application.githubProfile.name && (
                    <p>Name: {application.githubProfile.name}</p>
                  )}
                  {application.githubProfile.company && (
                    <p>Company: {application.githubProfile.company}</p>
                  )}
                  {application.githubProfile.location && (
                    <p>Location: {application.githubProfile.location}</p>
                  )}
                  {application.githubProfile.blog && (
                    <p>
                      Blog:{" "}
                      <a
                        href={application.githubProfile.blog}
                        className="text-accent no-underline hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {application.githubProfile.blog}
                      </a>
                    </p>
                  )}
                  {application.githubProfile.bio && (
                    <p className="italic">{application.githubProfile.bio}</p>
                  )}
                  {application.githubProfile.twitter_username && (
                    <p>
                      Twitter: @{application.githubProfile.twitter_username}
                    </p>
                  )}
                  <p className="pt-1 text-xs text-text-secondary/60">
                    {application.githubProfile.public_repos} public repos
                    &middot; {application.githubProfile.followers} followers
                    &middot; GitHub since{" "}
                    {application.githubProfile.created_at &&
                      new Date(
                        application.githubProfile.created_at,
                      ).getFullYear()}
                  </p>
                </div>
              )}
            </dd>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3">
          <dt className="w-32 text-xs sm:text-sm font-medium text-text-secondary">
            Organization
          </dt>
          <dd className="text-sm">{application.organization || "\u2014"}</dd>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3">
          <dt className="w-32 text-xs sm:text-sm font-medium text-text-secondary">
            Location
          </dt>
          <dd className="text-sm">{application.location || "\u2014"}</dd>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3">
          <dt className="w-32 text-xs sm:text-sm font-medium text-text-secondary">
            How heard
          </dt>
          <dd className="text-sm">{application.howHeard || "\u2014"}</dd>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3">
          <dt className="w-32 text-xs sm:text-sm font-medium text-text-secondary">
            Topics
          </dt>
          <dd className="text-sm">{formatTopics(application.topics)}</dd>
        </div>
        {application.story && (
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3">
            <dt className="w-32 shrink-0 text-xs sm:text-sm font-medium text-text-secondary">
              Story
            </dt>
            <dd className="text-sm">{application.story}</dd>
          </div>
        )}
        {application.summary && (
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3">
            <dt className="w-32 shrink-0 text-xs sm:text-sm font-medium text-text-secondary">
              Summary
            </dt>
            <dd className="text-sm italic text-accent">
              {application.summary}
            </dd>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3">
          <dt className="w-32 text-xs sm:text-sm font-medium text-text-secondary">
            Applied
          </dt>
          <dd className="text-sm">{formatDate(application.createdAt)}</dd>
        </div>
        {application.termsAcceptedAt && (
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3">
            <dt className="w-32 text-xs sm:text-sm font-medium text-text-secondary">
              Terms accepted
            </dt>
            <dd className="text-sm">
              {formatDate(application.termsAcceptedAt)}
            </dd>
          </div>
        )}
        {application.verifiedAt && (
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3">
            <dt className="w-32 text-xs sm:text-sm font-medium text-text-secondary">
              Verified
            </dt>
            <dd className="text-sm">{formatDate(application.verifiedAt)}</dd>
          </div>
        )}
        {application.editedAt && (
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3">
            <dt className="w-32 text-xs sm:text-sm font-medium text-text-secondary">
              Edited
            </dt>
            <dd className="text-sm">{formatDate(application.editedAt)}</dd>
          </div>
        )}
        {application.approvedAt && (
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3">
            <dt className="w-32 text-xs sm:text-sm font-medium text-text-secondary">
              Approved
            </dt>
            <dd className="text-sm">{formatDate(application.approvedAt)}</dd>
          </div>
        )}
        {application.rejectedAt && (
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3">
            <dt className="w-32 text-xs sm:text-sm font-medium text-text-secondary">
              Rejected
            </dt>
            <dd className="text-sm">{formatDate(application.rejectedAt)}</dd>
          </div>
        )}
      </dl>

      <div className="border-t border-border pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <ReviewActions application={application} />
          </div>
          <a
            href={link("/admin/applications/:id/edit", { id: application.id })}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-soft hover:text-text"
          >
            <EditIcon />
            Edit
          </a>
        </div>
      </div>
    </div>
  );
}
