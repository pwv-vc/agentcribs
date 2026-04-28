import { CtaButton } from "@/app/shared/cta-button";

export function HowItWorksSection() {
  return (
    <section className="bg-bg-soft border-y border-border">
      <div className="mx-auto max-w-[720px] px-6 py-16 sm:px-8 sm:py-24">
        <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          How Applications Work
        </h2>

        <p className="mt-6 leading-relaxed">
          We are prioritizing invitations for the May 6 AgentCribs event right
          now.
        </p>

        <p className="mt-5 leading-relaxed">
          Apply to join the community. Selected applicants will receive a separate
          registration invite for the event. Space is limited, and event details
          will be shared only with registered attendees.
        </p>

        <p className="mt-5 leading-relaxed">
          If you apply and are not invited to the May 6 event, or if you cannot
          attend, you will remain on our list for future AgentCribs opportunities,
          including online sessions and future in-person gatherings.
        </p>

        <div className="mt-8">
          <CtaButton />
        </div>
      </div>
    </section>
  );
}
