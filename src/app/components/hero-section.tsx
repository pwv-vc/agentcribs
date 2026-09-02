import { CtaButton } from "@/app/shared/cta-button";

export function HeroSection() {
  return (
    <section className="border-b border-border bg-bg">
      <div className="mx-auto max-w-[1040px] px-6 py-14 sm:px-8 sm:py-20">
        <h1 className="text-4xl font-black leading-none sm:text-7xl md:text-8xl">
          AgentCribs
        </h1>
        <h2 className="mt-8 text-xl font-black leading-[1.05] text-text sm:text-4xl md:text-5xl">
          A Curated Community for Agentic Software Builders
        </h2>
        <p className="mt-8 text-lg leading-relaxed text-text-secondary sm:text-xl">
          AgentCribs is a PWV community project for people already building
          with AI agents, developer tools, command-line workflows, and agentic
          software development practices. We bring together technical
          founders, senior developers, and hands-on builders creating the
          future of how software gets made.
        </p>
        <p className="mt-6 text-lg font-bold leading-relaxed">
          Space is limited. Apply to join the waitlist for upcoming events and
          community opportunities.
        </p>
        <div className="my-8 flex justify-left">
          <CtaButton />
        </div>
        <p className="mt-5 text-sm leading-relaxed text-text-secondary sm:text-base">
          If you cannot attend an upcoming event, you should still apply. We
          will follow up with selected applicants about future AgentCribs
          opportunities online and in person.
        </p>
      </div>
    </section>
  );
}
