import { Seo } from "@/app/components/seo";
import { getTopics } from "@/app/queries/application";
import { CtaButton } from "@/app/shared/cta-button";
import { ApplyForm } from "@/app/shared/apply-form";

export const Apply = async () => {
  const topics = await getTopics();

  return (
    <>
      <Seo
        title="Apply"
        description="Apply to join the curated AgentCribs community for builders working with AI agents. Selected applicants receive consideration for the May 6 event in San Francisco."
        canonical="https://agentcribs.com/apply"
      />
      <main className="mx-auto max-w-[640px] px-6 py-16 sm:px-8 sm:py-24">
      <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        Apply to join AgentCribs
      </h1>
      <p className="mt-4 text-base leading-relaxed text-text-secondary">
        Apply to join the curated AgentCribs community. Selected applicants will
        receive consideration for the May 6 event in San Francisco featuring
        Peter Levine and Tom Preston-Werner.
      </p>

      <ApplyForm topics={topics} />

      <div className="mt-16 border-t border-border pt-10">
        <p className="text-base leading-relaxed text-text-secondary">
          Already applied? Your application is automatically updated if you
          submit again with the same email address.
        </p>
        <div className="mt-6">
          <CtaButton href="/" label="&larr; Back to home" />
        </div>
      </div>
    </main>
    </>
  );
};
