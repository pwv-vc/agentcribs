"use client";

import { useTransition } from "react";
import { submitApplication } from "../actions/application";

export const ApplyForm = ({
  topics,
}: {
  topics: { id: string; label: string }[];
}) => {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      await submitApplication(formData);
      window.location.href = "/apply/thank-you";
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold">
            First name <span className="text-accent">*</span>
          </span>
          <input
            name="firstName"
            required
            className="rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text placeholder:text-text-secondary/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-base"
            placeholder="Jane"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold">
            Last name <span className="text-accent">*</span>
          </span>
          <input
            name="lastName"
            required
            className="rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text placeholder:text-text-secondary/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-base"
            placeholder="Doe"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">
          Email <span className="text-accent">*</span>
        </span>
        <input
          name="email"
          type="email"
          required
          className="rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text placeholder:text-text-secondary/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-base"
          placeholder="jane@example.com"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">
          Organization <span className="text-text-secondary">(optional)</span>
        </span>
        <input
          name="organization"
          className="rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text placeholder:text-text-secondary/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-base"
          placeholder="Company, school, project, etc."
        />
      </label>

      <fieldset>
        <legend className="text-sm font-semibold">
          Areas of interest{" "}
          <span className="text-text-secondary">(select all that apply)</span>
        </legend>
        <div className="mt-3 space-y-2.5">
          {topics.map((topic) => (
            <label
              key={topic.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-bg-secondary px-4 py-3 transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/5"
            >
              <input
                name="topics"
                type="checkbox"
                value={topic.id}
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
        <span className="text-sm font-semibold">
          Tell us more{" "}
          <span className="text-text-secondary">(optional)</span>
        </span>
        <textarea
          name="otherTopic"
          rows={3}
          className="rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text placeholder:text-text-secondary/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-base"
          placeholder="What are you building with AI agents?"
        />
      </label>

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
