export function EventSection() {
  return (
    <section className="border-b border-border bg-bg">
      <div className="mx-auto grid max-w-[1040px] gap-10 px-6 py-16 sm:px-8 sm:py-24 lg:grid-cols-[300px_1fr]">
        <div>
          <h2 className="text-4xl font-black leading-none sm:text-5xl">
            May 6 in San Francisco
          </h2>
          <p className="mt-5 text-xl font-black text-accent">
            PWV Founders + AgentCribs Community
          </p>
        </div>

        <div className="max-w-[680px] text-lg">
          <p className="leading-relaxed text-text-secondary">
            Join PWV founders, seasoned developers, and selected builders for an
            evening about how people are actually building with agents today.
          </p>

          <p className="mt-5 leading-relaxed">
            The main draw is a fireside chat between{" "}
            <strong className="text-text">Peter Levine</strong> of a16z and{" "}
            <strong className="text-text">Tom Preston-Werner</strong>, GitHub
            co-founder and PWV founder/investor.
          </p>

          <p className="mt-5 leading-relaxed text-text-secondary">
            The evening will also include an update from the core AgentCribs
            team, demos and discussion from people building with agents, and an
            invitation to participate in ongoing collaboration.
          </p>

          <p className="mt-5 font-mono text-sm text-text-secondary">
            Event details will be shared with registered attendees.
          </p>

        </div>
      </div>
    </section>
  );
}
