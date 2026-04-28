export function PwvSection() {
  return (
    <section className="mx-auto max-w-[1100px] px-6 py-12 sm:px-8 sm:py-16">
      <h2 className="font-serif text-2xl font-bold sm:text-3xl md:text-4xl">A PWV Community</h2>

      <p className="mt-4 text-sm leading-relaxed sm:text-base sm:mt-6">
        AgentCribs is a{" "}
        <a
          href="https://pwv.com/"
          className="font-bold text-accent no-underline hover:text-accent-hover"
        >
          PWV
        </a>{" "}
        community project and part of PWV's broader work building communities
        for technical founders and modern hackers.
      </p>

      <p className="mt-3 text-sm leading-relaxed sm:text-base sm:mt-4">
        PWV backs ambitious technical founders and creates spaces where builders
        can learn from each other, compare what is working, and accelerate the
        work already underway. AgentCribs brings that community approach to
        agentic software development.
      </p>

      <p className="mt-4 text-sm leading-relaxed sm:text-base sm:mt-6">
        Read more from PWV about AgentCribs:{" "}
        <a
          href="#"
          className="font-bold text-accent no-underline hover:text-accent-hover"
        >
          PWV AgentCribs post coming soon
        </a>
        .
      </p>
    </section>
  );
}
