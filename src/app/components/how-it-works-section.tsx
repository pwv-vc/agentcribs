import { CtaButton } from "@/app/shared/cta-button";

export function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-[1100px] px-6 py-12 sm:px-8 sm:py-16">
      <h2 className="font-serif text-2xl font-bold sm:text-3xl md:text-4xl">
        How Applications Work
      </h2>

      <p className="mt-4 text-sm leading-relaxed sm:text-base sm:mt-6">
        We are prioritizing invitations for the May 6 AgentCribs event right
        now.
      </p>

      <p className="mt-3 text-sm leading-relaxed sm:text-base sm:mt-4">
        Apply to join the community. Selected applicants will receive a separate
        registration invite for the event. Space is limited, and event details
        will be shared only with registered attendees.
      </p>

      <p className="mt-3 text-sm leading-relaxed sm:text-base sm:mt-4">
        If you apply and are not invited to the May 6 event, or if you cannot
        attend, you will remain on our list for future AgentCribs opportunities,
        including online sessions and future in-person gatherings.
      </p>

      <div className="mt-5 sm:mt-6">
        <CtaButton />
      </div>
    </section>
  );
}
