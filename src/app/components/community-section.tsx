import { CommunityVideo } from "@/app/components/community-video";

export function CommunitySection() {
  return (
    <section className="border-b border-border bg-bg">
      <div className="mx-auto max-w-[1040px] px-6 py-16 sm:px-8 sm:py-24">
        <div className="max-w-[820px]">
          <h2 className="text-4xl font-black leading-none sm:text-5xl">
            A PWV Community Project
          </h2>

          <p className="mt-8 text-lg leading-relaxed text-text-secondary">
            AgentCribs is part of PWV's broader work building communities for
            technical founders and modern hackers.
          </p>

          <p className="mt-5 text-lg leading-relaxed text-text-secondary">
            It began as a private gathering of PWV founders and close friends
            sharing the real tools, workflows, repos, and team practices they
            use to build software and run companies with AI.
          </p>

          <div className="mt-8 w-full">
            <CommunityVideo />
          </div>

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

          <p className="mt-10">
            <a
              href="https://pwv.com/"
              className="font-bold text-accent no-underline hover:text-accent-hover"
            >
              Learn more about PWV
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
