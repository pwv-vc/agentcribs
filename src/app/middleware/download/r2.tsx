import type { RouteMiddleware } from "rwsdk/router";
import { env } from "cloudflare:workers";
import { R2_KEY_PREFIX } from "@/app/actions/application";
import type { ApplicationData } from "@/app/actions/application";
import { createTar } from "@/app/lib/tar";
import type { TarEntry } from "@/app/lib/tar";
import { AdminApplications } from "@/app/pages/admin/applications";

const encoder = new TextEncoder();

const statusLabels: Record<string, string> = {
  unverified: "Unverified",
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
};

export const handleDownloadR2: RouteMiddleware = async (requestInfo) => {
  const url = new URL(requestInfo.request.url);
  const statusParam = url.searchParams.get("status") ?? undefined;

  const allKeys: string[] = [];
  let cursor: string | undefined;

  do {
    const list = await env.AGENTCRIBS_R2.list({
      prefix: R2_KEY_PREFIX,
      cursor,
    });
    for (const obj of list.objects) {
      allKeys.push(obj.key);
    }
    cursor = list.truncated ? list.cursor : undefined;
  } while (cursor);

  if (allKeys.length === 0) {
    requestInfo.ctx.flash = {
      message: "No applications found in R2 storage to download.",
    };
    const cleanRequest = new Request(
      `${url.origin}/admin/applications`,
      requestInfo.request,
    );
    return (
      <AdminApplications
        request={cleanRequest}
        ctx={requestInfo.ctx}
      />
    );
  }

  const results = await Promise.all(
    allKeys.map(async (key) => {
      const obj = await env.AGENTCRIBS_R2.get(key);
      if (!obj) return undefined;
      const raw = await obj.text();
      try {
        const app = JSON.parse(raw) as ApplicationData;
        const filename = key.replace(R2_KEY_PREFIX, "");
        return { app, filename };
      } catch {
        return undefined;
      }
    }),
  );

  const applications = results
    .filter(
      (r): r is { app: ApplicationData; filename: string } =>
        r !== undefined,
    )
    .filter(({ app }) => {
      if (!statusParam || statusParam === "all") return true;
      return app.status === statusParam;
    })
    .sort(
      (a, b) =>
        new Date(b.app.createdAt).getTime() -
        new Date(a.app.createdAt).getTime(),
    );

  if (applications.length === 0) {
    const statusLabel =
      statusParam && statusParam !== "all"
        ? statusLabels[statusParam] ?? statusParam
        : null;
    const message = statusLabel
      ? `No "${statusLabel}" applications found to download.`
      : "No applications found to download.";

    requestInfo.ctx.flash = { message };
    const cleanRequest = new Request(
      `${url.origin}/admin/applications`,
      requestInfo.request,
    );
    return (
      <AdminApplications
        request={cleanRequest}
        ctx={requestInfo.ctx}
      />
    );
  }

  const entries: TarEntry[] = applications.map(({ app, filename }) => ({
    name: filename,
    data: encoder.encode(JSON.stringify(app, null, 2)),
  }));

  const tar = createTar(entries);

  const label = statusParam && statusParam !== "all" ? statusParam : "all";
  const now = new Date();
  const timestamp = now.toISOString().replace(/:/g, "-").replace(/\..+/, "");

  return new Response(new Uint8Array(tar), {
    headers: {
      "Content-Type": "application/x-tar",
      "Content-Disposition": `attachment; filename="agentcribs-${label}-${timestamp}.tar"`,
    },
  });
};
