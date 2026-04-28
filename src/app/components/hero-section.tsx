import { CtaButton } from "@/app/shared/cta-button";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-[1100px] px-6 pt-20 pb-12 sm:px-8 sm:pt-24 sm:pb-16">
      <h1 className="font-serif text-4xl font-bold leading-[0.9] sm:text-5xl md:text-6xl md:leading-[0.9] lg:text-7xl">
        AgentCribs
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed sm:text-xl md:text-2xl">
        A PWV community project for people building the future of agentic
        software development.
      </p>
      <p className="mt-4 max-w-2xl text-base leading-relaxed sm:text-lg sm:mt-6">
        AgentCribs is publicly soft launching with an in-person event on
        Wednesday, May 6 in San Francisco, highlighted by a fireside chat
        between <strong>Peter Levine</strong> of a16z and{" "}
        <strong>Tom Preston-Werner</strong>, GitHub co-founder and PWV
        founder/investor.
      </p>
      <p className="mt-4 text-base font-semibold sm:text-lg sm:mt-6">
        Space is limited. Apply to join the curated AgentCribs community and
        receive consideration for an event registration invite.
      </p>
      <div className="mt-6 sm:mt-8">
        <CtaButton />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        If you cannot attend on May 6, you should still apply. We will follow up
        with selected applicants about future AgentCribs opportunities online
        and in person.
      </p>
    </section>
  );
}
