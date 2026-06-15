import { CtaButton } from "@/app/shared/cta-button";
import { BrandLink } from "@/app/components/links";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-t border-border py-6">
      <h3 className="text-xl font-black leading-tight sm:text-2xl">{question}</h3>
      <p className="mt-3 leading-relaxed text-text-secondary">{answer}</p>
    </div>
  );
}

export function FaqSection() {
  return (
    <section className="bg-bg">
      <div className="mx-auto max-w-[1040px] px-6 py-16 sm:px-8 sm:py-24">
        <div className="max-w-[820px]">
          <h2 className="text-4xl font-black leading-none sm:text-5xl">FAQ</h2>

          <FaqItem
            question="Who should apply?"
            answer="People already building with AI agents, developer tools, command-line workflows, or agentic software development practices. The strongest fit is a technical founder, senior developer, or hands-on builder actively experimenting in real projects."
          />

          <FaqItem
            question="Are AgentCribs events public?"
            answer="No. AgentCribs events are curated and space is limited. Apply to join AgentCribs first. Selected applicants receive a separate registration invite for events."
          />

          <FaqItem
            question="How do applications work?"
            answer="Applications are reviewed by our team. Selected applicants receive invitations to upcoming events and community opportunities. If you are not selected for a particular event, you remain on our list for future opportunities online and in person."
          />

          <FaqItem
            question="What if I cannot attend an event?"
            answer="You should still apply. We will follow up with selected applicants about future AgentCribs opportunities online and in person."
          />

          <FaqItem
            question="Where are events held?"
            answer="Event locations vary. Venue details will be shared with registered attendees for each event."
          />
        </div>

        <div className="mt-10 border-t border-border pt-12">
          <div className="max-w-[820px]">
            <h2 className="text-4xl font-black leading-none sm:text-5xl">
              Ready to join AgentCribs?
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-text-secondary">
              Apply to join the waitlist for upcoming events and opportunities.
            </p>

            <div className="mt-8">
              <CtaButton />
            </div>

            <p className="mt-8 leading-relaxed">
              Learn more about PWV at{" "}
              <BrandLink href="https://pwv.com/" external>
                pwv.com
              </BrandLink>
              .
            </p>

            <p className="mt-2 leading-relaxed">
              Need help? Email{" "}
              <BrandLink href="mailto:contact@agentcribs.com">
                contact@agentcribs.com
              </BrandLink>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
