import { CtaButton } from "@/app/shared/cta-button";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="mt-6 sm:mt-8">
      <h3 className="text-base font-bold sm:text-lg">{question}</h3>
      <p className="mt-2 text-sm leading-relaxed sm:text-base">{answer}</p>
    </div>
  );
}

export function FaqSection() {
  return (
    <section className="mx-auto max-w-[1100px] px-6 py-12 sm:px-8 sm:py-16">
      <h2 className="font-serif text-2xl font-bold sm:text-3xl md:text-4xl">FAQ</h2>

      <FaqItem
        question="Who should apply?"
        answer="People already building with AI agents, developer tools, command-line workflows, or agentic software development practices. The strongest fit is a technical founder, senior developer, or hands-on builder actively experimenting in real projects."
      />

      <FaqItem
        question="Is the May 6 event public?"
        answer="No. The event is curated and space is limited. Apply to join AgentCribs first. Selected applicants will receive a separate registration invite."
      />

      <FaqItem
        question="What if I cannot attend on May 6?"
        answer="You should still apply. We will follow up with selected applicants about future AgentCribs opportunities online and in person."
      />

      <FaqItem
        question="Where is the event?"
        answer="The event is in San Francisco. Venue details will be shared with registered attendees."
      />

      <div className="mt-12 border-t border-border pt-12 sm:mt-16 sm:pt-16">
        <h2 className="font-serif text-2xl font-bold sm:text-3xl md:text-4xl">
          AgentCribs is publicly soft launching now.
        </h2>

        <p className="mt-4 text-sm leading-relaxed sm:text-base sm:text-lg">
          Apply to join the community and receive consideration for the May 6
          San Francisco event featuring Peter Levine and Tom Preston-Werner.
        </p>

        <div className="mt-5 sm:mt-6">
          <CtaButton />
        </div>

        <p className="mt-6 text-sm leading-relaxed sm:text-base sm:mt-8">
          Learn more about PWV at{" "}
          <a
            href="https://pwv.com/"
            className="font-bold text-accent no-underline hover:text-accent-hover"
          >
            pwv.com
          </a>
          .
        </p>

        <p className="mt-2 text-sm leading-relaxed sm:text-base">
          Need help? Email{" "}
          <a
            href="mailto:agentcribs@pwv.com"
            className="font-bold text-accent no-underline hover:text-accent-hover"
          >
            agentcribs@pwv.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}
