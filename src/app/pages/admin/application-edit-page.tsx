import { getApplication } from "@/app/queries/application";
import { AdminApplicationEdit } from "./application-edit";
import { Seo } from "@/app/components/seo";

export async function AdminApplicationEditPage({ id }: { id: string }) {
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

  return <AdminApplicationEdit application={application} />;
}
