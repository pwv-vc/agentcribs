import { Seo } from "@/app/components/seo";
import { CtaButton } from "@/app/shared/cta-button";

export const ThankYou = () => {
  return (
    <>
      <Seo
        title="Application received"
        description="Thanks for applying to AgentCribs. We'll review your application and be in touch."
        canonical="https://agentcribs.com/apply/thank-you"
      />
      <main className="mx-auto max-w-[640px] px-6 py-24 sm:px-8 sm:py-32">
      <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        Application received
      </h1>
      <p className="mt-6 text-lg leading-relaxed">
        Thanks for applying to join AgentCribs!
      </p>
      <p className="mt-5 text-base leading-relaxed text-text-secondary">
        We've sent a verification link to your email. Click it to confirm your
        application and make it visible to our review team. The link expires in
        1 hour.
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
