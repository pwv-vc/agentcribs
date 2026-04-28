import { getApplication } from "@/app/queries/application";
import { ApplicationDetail } from "@/app/components/application-detail";
import { CtaButton } from "@/app/shared/cta-button";

export async function AdminApplicationDetail({ id }: { id: string }) {
  const application = await getApplication(id);

  if (!application) {
    return (
      <main className="mx-auto max-w-[800px] px-6 py-16 sm:px-8 sm:py-20">
        <h1 className="font-serif text-3xl font-bold">Application not found</h1>
        <p className="mt-2 text-text-secondary">No application with ID {id}.</p>
        <div className="mt-8">
          <CtaButton href="/admin/applications" label="&larr; Back to applications" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[800px] px-6 py-16 sm:px-8 sm:py-20">
      <div className="mb-8">
        <CtaButton href="/admin/applications" label="&larr; Back to applications" />
      </div>
      <ApplicationDetail application={application} />
    </main>
  );
}
