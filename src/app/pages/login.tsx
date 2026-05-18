"use client";

import { Seo } from "@/app/components/seo";
import { initiateAccountLogin } from "@/app/actions/account";

export function LoginPage({
  sent,
  expired,
}: {
  sent: boolean;
  expired: boolean;
}) {
  return (
    <>
      <Seo title="Sign In" description="Sign in to your AgentCribs account." />
      <main className="mx-auto max-w-[480px] px-6 py-16 sm:px-8 sm:py-24">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Sign in
        </h1>

        {expired ? (
          <div className="mt-8 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-6">
            <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-3">
              Link expired
            </h2>
            <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
              Your sign-in link has expired. Magic links are valid for 15 minutes.
              Enter your email below to receive a new one.
            </p>
          </div>
        ) : sent ? (
          <div className="mt-8 rounded-xl border border-border bg-surface-soft p-6">
            <h2 className="text-lg font-semibold text-text mb-3">
              Check your email
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              We sent a sign-in link to your email. Click the link in the
              email to sign in.
            </p>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              If you don't receive an email within a few minutes, check your
              spam folder and{" "}
              <a href="/apply" className="text-accent underline">
                make sure you've applied
              </a>
              — only applicants with an account can sign in.
            </p>
          </div>
        ) : (
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Enter your email and we'll send you a magic link to sign in.
          </p>
        )}

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            await initiateAccountLogin(formData);
          }}
          className="mt-8"
        >
          <label
            htmlFor="email"
            className="block text-sm font-medium text-text mb-2"
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-text placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none"
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-hover transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            Send sign-in link
          </button>
        </form>
      </main>
    </>
  );
}
