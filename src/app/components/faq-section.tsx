import { CtaButton } from "@/app/shared/cta-button";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="mt-8 sm:mt-10">
      <h3 className="font-serif text-xl font-bold tracking-tight sm:text-2xl">{question}</h3>
      <p className="mt-3 leading-relaxed">{answer}</p>
    </div>
  );
}

export function FaqSection() {
  return (
    <section className="bg-bg-soft border-y border-border">
      <div className="mx-auto max-w-[720px] px-6 py-16 sm:px-8 sm:py-24">
        <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">FAQ</h2>

        <FaqItem
          question="Who should apply?"
          answer="People already building with AI agents, developer tools, command-line workflows, or agentic software development practices. The strongest fit is a technical founder, senior developer, or hands-on builder actively experimenting in real projects."
        />

        <FaqItem
          question="Is the May 6 event public?"
          answer="No. The event is curated and space is limited. Apply to join AgentCribs first. Selected applicants will receive a separate registration invite."
        />

        <FaqItem
          question="How do applications work?"
          answer="We are prioritizing invitations for the May 6 AgentCribs event right now. Selected applicants will receive a separate registration invite for the event. If you are not invited to the May 6 event, or if you cannot attend, you will remain on our list for future AgentCribs opportunities online and in person."
        />

        <FaqItem
          question="What if I cannot attend on May 6?"
          answer="You should still apply. We will follow up with selected applicants about future AgentCribs opportunities online and in person."
        />

        <FaqItem
          question="Where is the event?"
          answer="The event is in San Francisco. Venue details will be shared with registered attendees."
        />

        <div className="mt-16 border-t border-border pt-12">
          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            AgentCribs is publicly soft launching now.
          </h2>

          <p className="mt-6 text-lg leading-relaxed">
            Apply to join the community and receive consideration for the May 6
            San Francisco event featuring Peter Levine and Tom Preston-Werner.
          </p>

          <div className="mt-8">
            <CtaButton />
          </div>

          <p className="mt-8 leading-relaxed">
            Learn more about PWV at{" "}
            <a
              href="https://pwv.com/"
              className="font-bold text-accent no-underline hover:text-accent-hover"
            >
              pwv.com
            </a>
            .
          </p>

          <p className="mt-2 leading-relaxed">
            Need help? Email{" "}
            <a
              href="mailto:contact@agentcribs.com"
              className="font-bold text-accent no-underline hover:text-accent-hover"
            >
              contact@agentcribs.com
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
