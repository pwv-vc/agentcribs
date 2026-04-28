import { Seo } from "@/app/components/seo";
import { CtaButton } from "@/app/shared/cta-button";

export const VerifySuccess = () => {
  return (
    <>
      <Seo
        title="Email verified"
        description="Your email has been verified. Your application is now under review."
        canonical="https://agentcribs.com/apply/verify/success"
      />
      <main className="mx-auto max-w-[640px] px-6 py-24 sm:px-8 sm:py-32">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Email verified
        </h1>
        <p className="mt-6 text-lg leading-relaxed">
          Your email has been verified and your application is now under review.
        </p>
        <p className="mt-5 text-base leading-relaxed text-text-secondary">
          We'll be in touch at the email you provided. If you're selected for
          the May 6 event in San Francisco, you'll receive a separate
          registration invite with event details.
        </p>
        <div className="mt-12">
          <CtaButton href="/" label="&larr; Back to home" />
        </div>
      </main>
    </>
  );
};
