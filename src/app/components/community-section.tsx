export function CommunitySection() {
  return (
    <section className="border-b border-border bg-bg">
      <div className="mx-auto grid max-w-[1040px] gap-12 px-6 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_320px]">
        <div className="max-w-[720px]">
          <h2 className="text-4xl font-black leading-none sm:text-5xl">
            A Curated Community for Agentic Software Builders
          </h2>

          <p className="mt-8 text-lg leading-relaxed text-text-secondary">
            AgentCribs began as a private gathering of PWV founders and close
            friends sharing the real tools, workflows, repos, and team
            practices they use to build software and run companies with AI.
          </p>

          <p className="mt-5 text-lg leading-relaxed text-text-secondary">
            Now we are opening the community selectively to more people already
            experimenting, learning, and building with agentic software
            development.
          </p>

          <p className="mt-5 text-lg leading-relaxed text-text-secondary">
            The strongest fit is a technical founder, senior developer, or
            hands-on builder creating products, companies, developer tools,
            internal systems, agent workflows, or new ways to ship faster from
            the command line.
          </p>

          <p className="mt-7 border-l-4 border-accent pl-5 text-xl font-black leading-tight">
            This is not a beginner AI meetup. It is a working community for
            people already building who want to compare notes with peers doing
            the same.
          </p>
        </div>

        <aside className="self-start border border-[#303027] bg-[#090907] p-6 text-[#f7f2df]">
          <img
            src="/pwv-logo-white.svg"
            alt="PWV"
            className="h-auto w-24"
            width="800"
            height="197"
          />
          <h3 className="mt-8 text-2xl font-black leading-tight">
            A PWV community project
          </h3>
          <p className="mt-4 leading-relaxed text-[#b9b39e]">
            AgentCribs is part of{" "}
            <a
              href="https://pwv.com/"
              className="font-bold text-[#04d936] no-underline hover:text-[#58f06f]"
            >
              PWV
            </a>
            's broader work building communities for technical founders and
            modern hackers.
          </p>
          <p className="mt-5 font-mono text-sm text-[#b9b39e]">
            PWV AgentCribs post coming soon.
          </p>
        </aside>
      </div>
    </section>
  );
}
