"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { submitApplication } from "../actions/application";
import {
  startGitHubOAuth,
  getGitHubVerification,
} from "../actions/github";

const SESSION_KEY = "agentcribs-apply-form";

const ERROR_MESSAGES: Record<string, string> = {
  expired: "Verification expired. Please try again.",
  email_mismatch:
    "The GitHub email doesn't match the email you entered.",
  no_verified_email:
    "Your GitHub account must have a verified primary email.",
  api_error: "Something went wrong. Please try again.",
};

function saveFormState(form: HTMLFormElement) {
  const data = new FormData(form);
  const state: Record<string, string | string[]> = {};
  for (const [key, value] of data) {
    if (key === "topics") {
      const prev = state[key];
      state[key] = prev ? [...(prev as string[]), value as string] : [value as string];
    } else {
      state[key] = value as string;
    }
  }
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
  } catch {
    // sessionStorage may be unavailable
  }
}

function restoreFormState(): Record<string, string | string[]> | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const ApplyForm = ({
  topics,
}: {
  topics: { id: string; label: string }[];
}) => {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organization, setOrganization] = useState("");
  const [otherTopic, setOtherTopic] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [githubStateNonce, setGithubStateNonce] = useState<string | null>(null);
  const [githubHandle, setGithubHandle] = useState<string | null>(null);
  const [githubAvatarUrl, setGithubAvatarUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const urlCleaned = useRef(false);

  // Check URL params on mount for OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const state = params.get("github_state");
    const err = params.get("github_error");

    // Restore saved form state before processing callback
    const saved = restoreFormState();
    if (saved) {
      setEmail((saved.email as string) ?? "");
      setFirstName((saved.firstName as string) ?? "");
      setLastName((saved.lastName as string) ?? "");
      setOrganization((saved.organization as string) ?? "");
      setOtherTopic((saved.otherTopic as string) ?? "");
      if (saved.topics) {
        setSelectedTopics(new Set(saved.topics as string[]));
      }
      sessionStorage.removeItem(SESSION_KEY);
    }

    if (state) {
      getGitHubVerification(state).then((verification) => {
        if (verification) {
          setGithubHandle(verification.githubHandle);
          setGithubAvatarUrl(verification.githubAvatarUrl);
          setGithubStateNonce(state);
        }
      });
    }

    if (err && err in ERROR_MESSAGES) {
      setError(ERROR_MESSAGES[err]);
    }

    // Clean URL — only once per navigation
    if ((state || err) && !urlCleaned.current) {
      urlCleaned.current = true;
      window.history.replaceState({}, "", "/apply");
    }
  }, []);

  const handleGitHubConnect = async () => {
    if (!email) return;

    setIsVerifying(true);
    setError(null);

    // Save current form state before redirect
    if (formRef.current) {
      saveFormState(formRef.current);
    }

    try {
      const url = await startGitHubOAuth(email);
      window.location.href = url;
    } catch {
      setError("Failed to start GitHub verification. Please try again.");
      setIsVerifying(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    if (githubStateNonce) {
      formData.set("github_state", githubStateNonce);
    }

    startTransition(async () => {
      await submitApplication(formData);
      window.location.href = "/apply/thank-you";
    });
  };

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef} className="mt-8 space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text">
            First name <span className="text-accent">*</span>
          </span>
          <input
            name="firstName"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="rounded-lg border border-border bg-bg-soft px-4 py-2.5 text-sm text-text placeholder:text-text-secondary/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-base"
            placeholder="Jane"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-text">
            Last name <span className="text-accent">*</span>
          </span>
          <input
            name="lastName"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="rounded-lg border border-border bg-bg-soft px-4 py-2.5 text-sm text-text placeholder:text-text-secondary/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-base"
            placeholder="Doe"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">
          Email <span className="text-accent">*</span>
        </span>
        <input
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-border bg-bg-soft px-4 py-2.5 text-sm text-text placeholder:text-text-secondary/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-base"
          placeholder="jane@example.com"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">
          Organization <span className="text-text-secondary">(optional)</span>
        </span>
        <input
          name="organization"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          className="rounded-lg border border-border bg-bg-soft px-4 py-2.5 text-sm text-text placeholder:text-text-secondary/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-base"
          placeholder="Company, school, project, etc."
        />
      </label>

      <fieldset>
        <legend className="text-sm font-semibold text-text">
          Areas of interest{" "}
          <span className="text-text-secondary">(select all that apply)</span>
        </legend>
        <div className="mt-4 space-y-3">
          {topics.map((topic) => (
            <label
              key={topic.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-bg-soft px-4 py-3 transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/5"
            >
              <input
                name="topics"
                type="checkbox"
                value={topic.id}
                checked={selectedTopics.has(topic.id)}
                onChange={() => toggleTopic(topic.id)}
                className="mt-0.5 h-4 w-4 rounded border-border accent-accent"
              />
              <span className="text-sm leading-relaxed sm:text-base">
                {topic.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text">
          Tell us more{" "}
          <span className="text-text-secondary">(optional)</span>
        </span>
        <textarea
          name="otherTopic"
          rows={3}
          value={otherTopic}
          onChange={(e) => setOtherTopic(e.target.value)}
          className="rounded-lg border border-border bg-bg-soft px-4 py-2.5 text-sm text-text placeholder:text-text-secondary/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-base"
          placeholder="What are you building with AI agents?"
        />
      </label>

      {/* GitHub verification — moved to bottom */}
      <div className="border-t border-border pt-6">
        <p className="mb-1 text-sm font-semibold text-text">Connect GitHub</p>
        <p className="mb-4 text-sm text-text-secondary">
          Verifying your GitHub helps us get to know you and what you're building. It's optional but recommended.
        </p>
        {githubHandle ? (
          <div className="flex items-center gap-3 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3">
            {githubAvatarUrl && (
              <img
                src={githubAvatarUrl}
                alt=""
                className="h-6 w-6 rounded-full"
              />
            )}
            <span className="text-sm text-text">
              Verified as <span className="font-semibold">@{githubHandle}</span>
            </span>
            <span className="ml-auto text-xs font-medium text-accent">
              Connected
            </span>
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={handleGitHubConnect}
              disabled={!email || isVerifying}
              className="flex items-center gap-2 rounded-lg border border-border bg-bg-soft px-4 py-2.5 text-sm font-medium text-text transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
            >
              {isVerifying ? (
                "Connecting..."
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Connect GitHub
                </>
              )}
            </button>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
            {!email && (
              <p className="mt-2 text-sm text-text-secondary">
                Enter your email first to verify with GitHub.
              </p>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="block w-full rounded-lg bg-accent px-6 py-3 text-center text-base font-bold text-accent-text no-underline transition-colors hover:bg-accent-hover disabled:opacity-50 sm:inline-block sm:w-auto sm:px-10 sm:py-3.5 sm:text-lg"
      >
        {isPending ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
};
