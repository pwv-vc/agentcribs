export function CommunitySection() {
  return (
    <section className="mx-auto max-w-[720px] px-6 py-16 sm:px-8 sm:py-24">
      <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        A Curated Community for Agentic Software Builders
      </h2>

      <p className="mt-6 leading-relaxed">
        AgentCribs began as a private gathering of PWV founders and close
        friends sharing the real tools, workflows, repos, and team practices
        they use to build software and run companies with AI.
      </p>

      <p className="mt-5 leading-relaxed">
        Now we are opening the community selectively to more people already
        experimenting, learning, and building with agentic software development.
      </p>

      <p className="mt-5 leading-relaxed">
        The strongest fit is a technical founder, senior developer, or hands-on
        builder creating products, companies, developer tools, internal systems,
        agent workflows, or new ways to ship faster from the command line.
      </p>

      <p className="mt-6 font-semibold leading-relaxed">
        This is not a beginner AI meetup. It is a working community for people
        already building who want to compare notes with peers doing the same.
      </p>

      <div className="mt-10 border-l-4 border-accent pl-6">
        <h3 className="font-serif text-2xl font-bold tracking-tight">
          A PWV community project
        </h3>
        <p className="mt-3 leading-relaxed">
          AgentCribs is part of{" "}
          <a
            href="https://pwv.com/"
            className="font-bold text-accent no-underline hover:text-accent-hover"
          >
            PWV
          </a>
          's broader work building communities for technical founders and
          modern hackers.
        </p>
        <p className="mt-3 leading-relaxed text-text-secondary">
          PWV AgentCribs post coming soon.
        </p>
      </div>
    </section>
  );
}
