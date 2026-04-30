import { CtaButton } from "@/app/shared/cta-button";

export function HeroSection() {
  return (
    <section className="border-b border-border bg-bg">
      <div className="mx-auto max-w-[1040px] px-6 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[820px] lg:mx-auto">
          <p className="label-text mb-8 text-base sm:text-xl">
            May 6 in San Francisco
          </p>
          <h1 className="max-w-[760px] text-5xl font-black leading-none sm:text-7xl md:text-8xl">
            AgentCribs
          </h1>
          <p className="mt-8 max-w-[820px] text-2xl font-black leading-[1.05] text-text sm:text-4xl md:text-5xl">
            Peter Levine +{" "}
            <span className="whitespace-nowrap">Tom Preston-Werner</span>.
            <br />
            One night in San Francisco.
          </p>
          <p className="mt-8 max-w-[720px] text-lg leading-relaxed text-text-secondary sm:text-xl">
            AgentCribs is a PWV community project for people already building
            with AI agents, publicly soft launching with a fireside chat
            between <strong className="text-text">Peter Levine</strong> of a16z
            and <strong className="text-text">Tom Preston-Werner</strong>, GitHub
            co-founder and PWV founder/investor.
          </p>
          <p className="mt-6 max-w-[720px] text-lg font-bold leading-relaxed">
            Space is limited. Apply to join the curated community and receive
            consideration for a separate event registration invite.
          </p>
          <div className="mt-9">
            <CtaButton />
          </div>
          <p className="mt-5 max-w-[720px] text-sm leading-relaxed text-text-secondary sm:text-base">
            If you cannot attend on May 6, you should still apply. We will
            follow up with selected applicants about future AgentCribs
            opportunities online and in person.
          </p>
        </div>
      </div>
    </section>
  );
}
