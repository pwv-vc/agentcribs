import { CtaButton } from "@/app/shared/cta-button";

export function EventSection() {
  return (
    <section className="bg-bg-soft border-y border-border">
      <div className="mx-auto max-w-[720px] px-6 py-16 sm:px-8 sm:py-24">
        <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          May 6 in San Francisco
        </h2>
        <p className="mt-3 text-lg font-semibold sm:text-xl">
          PWV Founders + AgentCribs
        </p>

        <p className="mt-6 leading-relaxed">
          Join PWV founders, seasoned developers, and selected builders for an
          evening about how people are actually building with agents today.
        </p>

        <p className="mt-5 leading-relaxed">
          The main draw is a fireside chat between <strong>Peter Levine</strong>{" "}
          of a16z and <strong>Tom Preston-Werner</strong>, GitHub co-founder and
          PWV founder/investor.
        </p>

        <p className="mt-5 leading-relaxed">
          The evening will also include an update from the core AgentCribs team,
          demos and discussion from people building with agents, and an
          invitation to participate in ongoing collaboration.
        </p>

        <p className="mt-5 italic leading-relaxed text-text-secondary">
          Event details will be shared with registered attendees.
        </p>

        <div className="mt-8">
          <CtaButton />
        </div>
      </div>
    </section>
  );
}
