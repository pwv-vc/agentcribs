import { getApplication } from "@/app/queries/application";
import { ApplicationDetail } from "@/app/components/application-detail";
import { CtaButton } from "@/app/shared/cta-button";
import { Seo } from "@/app/components/seo";
import { link } from "@/app/shared/links";

export async function AdminApplicationDetail({ id }: { id: string }) {
  const application = await getApplication(id);

  if (!application) {
    return (
      <>
        <Seo
          title="Application Not Found | Admin | AgentCribs"
          description="The requested application could not be found."
          noIndex
        />
        <main className="mx-auto max-w-[800px] px-6 py-16 sm:px-8 sm:py-20">
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Application not found
          </h1>
          <p className="mt-2 text-text-secondary">
            No application with ID {id}.
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <Seo
        title={`${application.firstName} ${application.lastName} | Admin | AgentCribs`}
        description={`Application detail for ${application.firstName} ${application.lastName}.`}
        noIndex
      />
      <main className="mx-auto max-w-[800px] px-6 py-16 sm:px-8 sm:py-20">
        <ApplicationDetail application={application} />
      </main>
    </>
  );
}
