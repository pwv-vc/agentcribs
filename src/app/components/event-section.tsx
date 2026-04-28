import { CtaButton } from "@/app/shared/cta-button";

export function EventSection() {
  return (
    <section className="mx-auto max-w-[1100px] px-6 py-12 sm:px-8 sm:py-16">
      <h2 className="font-serif text-2xl font-bold sm:text-3xl md:text-4xl">
        May 6 in San Francisco
      </h2>
      <p className="mt-2 text-base font-semibold sm:text-lg md:text-xl">
        AgentCribs: Show & Tell, hosted by PWV
      </p>

      <p className="mt-4 text-sm leading-relaxed sm:text-base sm:mt-6">
        Join PWV founders, seasoned developers, and selected builders for an
        evening about how people are actually building with agents today.
      </p>

      <p className="mt-3 text-sm leading-relaxed sm:text-base sm:mt-4">
        The evening will include an update from the core AgentCribs team, demos
        and discussion from people building with agents, and an invitation to
        participate in ongoing collaboration.
      </p>

      <p className="mt-3 text-sm leading-relaxed sm:text-base sm:mt-4">
        The highlight of the evening will be a fireside chat between{" "}
        <strong>Peter Levine</strong> of a16z and{" "}
        <strong>Tom Preston-Werner</strong>, GitHub co-founder and PWV
        founder/investor.
      </p>

      <p className="mt-3 text-sm italic leading-relaxed text-text-secondary sm:text-base sm:mt-4">
        Event details will be shared with registered attendees.
      </p>

      <div className="mt-5 sm:mt-6">
        <CtaButton />
      </div>
    </section>
  );
}
