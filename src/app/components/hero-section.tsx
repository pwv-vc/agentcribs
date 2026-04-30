import { CtaButton } from "@/app/shared/cta-button";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-[900px] px-6 pt-24 pb-16 sm:px-8 sm:pt-32 sm:pb-20">
      <p className="mb-6 inline-flex rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-base font-bold uppercase tracking-[0.16em] text-accent sm:text-lg">
        May 6 in San Francisco
      </p>
      <h1 className="font-serif text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
        AgentCribs
      </h1>
      <p className="mt-6 max-w-[760px] font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
        Peter Levine + Tom Preston-Werner. One night in San Francisco.
      </p>
      <p className="mt-6 max-w-[680px] text-xl leading-relaxed sm:text-2xl">
        AgentCribs is a PWV community project for people already building with
        AI agents, publicly soft launching with a fireside chat between{" "}
        <strong>Peter Levine</strong> of a16z and{" "}
        <strong>Tom Preston-Werner</strong>, GitHub co-founder and PWV
        founder/investor.
      </p>
      <p className="mt-6 text-base font-semibold sm:text-lg">
        Space is limited. Apply to join the curated community and receive
        consideration for a separate event registration invite.
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
