import { Seo } from "@/app/components/seo";
import { CtaButton } from "@/app/shared/cta-button";

export const ThankYou = () => {
  return (
    <>
      <Seo
        title="One more step"
        description="There's one more step for your AgentCribs application. Check your email for the final verification link."
        canonical="https://agentcribs.com/apply/thank-you"
      />
      <main className="mx-auto max-w-[640px] px-6 py-24 sm:px-8 sm:py-32">
      <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        There's one more step!
      </h1>
      <p className="mt-6 text-lg leading-relaxed">
        Thanks for applying to join AgentCribs. We sent you an email with the
        final verification step for your application.
      </p>
      <p className="mt-5 text-base leading-relaxed text-text-secondary">
        Open the email titled "Final step for your AgentCribs application" and
        click the verification link. That confirms your email address and makes
        your application visible to our review team. The link expires in 1 hour.
      </p>
      <p className="mt-5 text-base leading-relaxed text-text-secondary">
        If you do not see it, check your spam folder. If you still need help,
        email{" "}
        <a
          href="mailto:support@agentcribs.com"
          className="font-medium text-accent underline decoration-border underline-offset-2 transition-colors hover:text-accent-hover"
        >
          support@agentcribs.com
        </a>
        .
      </p>
      <p className="mt-5 text-base leading-relaxed text-text-secondary">
        If you're selected for the May 6 event in San Francisco, you'll receive
        a separate registration invite with event details. If you can't attend
        in person or aren't selected this time, you'll remain on our list for
        future AgentCribs opportunities.
      </p>
      <div className="mt-12">
        <CtaButton href="/" label="&larr; Back to home" />
      </div>
    </main>
    </>
  );
};
