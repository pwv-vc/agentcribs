import { Seo } from "@/app/components/seo";
import { CtaButton } from "@/app/shared/cta-button";

export const VerifyError = () => {
  return (
    <>
      <Seo
        title="Verification failed"
        description="This verification link is invalid or has expired."
        canonical="https://agentcribs.com/apply/verify/error"
      />
      <main className="mx-auto max-w-[640px] px-6 py-24 sm:px-8 sm:py-32">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Verification failed
        </h1>
        <p className="mt-6 text-lg leading-relaxed">
          This verification link is invalid or has expired.
        </p>
        <p className="mt-5 text-base leading-relaxed text-text-secondary">
          If you still need to verify your email, you can submit your
          application again to receive a new link.
        </p>
        <div className="mt-12">
          <CtaButton href="/apply" label="&larr; Apply again" />
        </div>
      </main>
    </>
  );
};
