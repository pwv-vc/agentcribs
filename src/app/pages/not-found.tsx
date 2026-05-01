import { Seo } from "@/app/components/seo";
import { CtaButton } from "@/app/shared/cta-button";

export function NotFound({ response }: { response?: { status: number } }) {
  if (response) {
    response.status = 404;
  }

  return (
    <>
      <Seo
        title="Page Not Found | AgentCribs"
        description="The page you're looking for doesn't exist."
        noIndex
      />

      <main className="mx-auto max-w-[640px] px-6 py-24 text-center sm:px-8 sm:py-32">
        <h1 className="font-serif text-6xl font-bold tracking-tight text-foreground sm:text-7xl md:text-8xl">
          404
        </h1>

        <p className="mt-6 text-lg leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="mt-12">
          <CtaButton href="/" label="&larr; Home" />
        </div>
      </main>
    </>
  );
}
