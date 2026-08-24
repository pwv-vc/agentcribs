import { CtaButton } from "@/app/shared/cta-button";
import { BrandLink } from "@/app/components/links";
import { getFaqs, type Faq } from "@/app/queries/faqs";

function FaqItem({ faq }: { faq: Faq }) {
  return (
    <div className="border-t border-border py-9">
      <h3 className="text-xl font-black leading-tight sm:text-2xl">
        {faq.question}
      </h3>
      <div
        className="prose mt-3 max-w-none leading-relaxed text-text-secondary"
        dangerouslySetInnerHTML={{ __html: faq.content }}
      />
    </div>
  );
}

export const FaqSection = async () => {
  const faqs = await getFaqs();

  return (
    <section className="bg-bg">
      <div className="mx-auto max-w-[1040px] px-6 py-16 sm:px-8 sm:py-24">
        <div className="max-w-[820px]">
          <h2 className="mb-9 text-4xl font-black leading-none sm:text-5xl">FAQ</h2>

          {faqs.map((faq) => (
            <FaqItem key={faq.id} faq={faq} />
          ))}
        </div>

        <div className="mt-14 border-t border-border pt-14">
          <div className="max-w-[820px]">
            <h2 className="text-4xl font-black leading-[1.1] sm:text-5xl sm:leading-none">
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
};
