import { CtaButton } from "@/app/shared/cta-button";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-[900px] px-6 pt-24 pb-16 sm:px-8 sm:pt-32 sm:pb-20">
      <h1 className="font-serif text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
        AgentCribs
      </h1>
      <p className="mt-6 max-w-[640px] text-xl leading-relaxed sm:text-2xl md:text-3xl">
        A PWV community project for people building the future of agentic
        software development.
      </p>
      <p className="mt-6 max-w-[640px] text-base leading-relaxed sm:text-lg">
        AgentCribs is publicly soft launching with an in-person event on
        Wednesday, May 6 in San Francisco, highlighted by a fireside chat
        between <strong>Peter Levine</strong> of a16z and{" "}
        <strong>Tom Preston-Werner</strong>, GitHub co-founder and PWV
        founder/investor.
      </p>
      <p className="mt-6 text-base font-semibold sm:text-lg">
        Space is limited. Apply to join the curated AgentCribs community and
        receive consideration for an event registration invite.
      </p>
      <div className="mt-8">
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
