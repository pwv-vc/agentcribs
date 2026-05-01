"use client";

import { useState, useTransition } from "react";
import { updateApplication } from "@/app/actions/application";
import type { ApplicationData } from "@/app/actions/application";
import { Seo } from "@/app/components/seo";
import { link } from "@/app/shared/links";

interface AdminApplicationEditProps {
  application: ApplicationData;
}

export function AdminApplicationEdit({ application }: AdminApplicationEditProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState(application.firstName);
  const [lastName, setLastName] = useState(application.lastName);
  const [email, setEmail] = useState(application.email);
  const [location, setLocation] = useState(application.location ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError("First name, last name, and email are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Please provide a valid email address.");
      return;
    }

    startTransition(async () => {
      try {
        await updateApplication(application.id, {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          location: location.trim(),
        });
        // Redirect handled by server action on success
      } catch (err) {
        setError("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <>
      <Seo
        title={`Edit ${application.firstName} ${application.lastName} | Admin | AgentCribs`}
        description={`Edit application for ${application.firstName} ${application.lastName}.`}
        noIndex
      />
      <main className="mx-auto max-w-[600px] px-6 py-16 sm:px-8 sm:py-20">
        <div className="mb-8">
          <a
            href={link("/admin/applications/:id", { id: application.id })}
            className="text-sm text-text-secondary hover:text-accent"
          >
            ← Back to application
          </a>
        </div>

        <h1 className="font-serif text-3xl font-bold tracking-tight">
          Edit Application
        </h1>
        <p className="mt-2 text-text-secondary">
          {application.firstName} {application.lastName}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-text">
                First name <span className="text-accent">*</span>
              </span>
              <input
                type="text"
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
                type="text"
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
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-border bg-bg-soft px-4 py-2.5 text-sm text-text placeholder:text-text-secondary/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-base"
              placeholder="jane@example.com"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-text">Location</span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-lg border border-border bg-bg-soft px-4 py-2.5 text-sm text-text placeholder:text-text-secondary/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-base"
              placeholder="San Francisco, CA"
            />
          </label>

          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <a
              href={link("/admin/applications/:id", { id: application.id })}
              className="rounded-lg border border-border bg-bg-soft px-6 py-2.5 text-center text-sm font-medium text-text transition-colors hover:bg-bg-muted"
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-brand-green px-6 py-2.5 text-center text-sm font-bold text-accent-text transition-colors hover:bg-brand-green-hover disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
