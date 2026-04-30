import { layout, render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";

import { Document } from "@/app/document";
import { setCommonHeaders } from "@/app/headers";
import { Layout } from "@/app/layouts/default";
import { AdminLayout } from "@/app/layouts/admin";
import { handleGitHubCallback } from "@/app/middleware/github/callback";
import { handleVerificationCallback } from "@/app/middleware/verify/callback";
import { requireCloudflareAccess } from "@/app/middleware/auth/cloudflare-access";
import { AdminApplications } from "@/app/pages/admin/applications";
import { AdminApplicationDetail } from "@/app/pages/admin/application";
import { Apply } from "@/app/pages/apply";
import { ThankYou } from "@/app/pages/thank-you";
import { VerifySuccess } from "@/app/pages/verify-success";
import { VerifyError } from "@/app/pages/verify-error";
import { Terms } from "@/app/pages/terms";
import { Privacy } from "@/app/pages/privacy";
import { Home } from "@/app/pages/home";
import { NotFound } from "@/app/pages/not-found";
import {
  handleProcessApplication,
  handleSendEmail,
  handleSendNotification,
  handleSendSlack,
} from "@/app/actions/queue";
import type { ApplicationPayload } from "@/app/actions/application";

export type AppContext = {
  session?: { email: string; sub: string };
};

export const app = defineApp([
  setCommonHeaders(),
  ({ ctx }) => {
    // setup ctx here
    ctx;
  },
  render(Document, [
    layout(Layout, [
      route("/", Home),
      route("/terms", Terms),
      route("/privacy", Privacy),
      route("/apply", Apply),
      route("/apply/thank-you", ThankYou),
      route("/apply/github/callback", handleGitHubCallback),
      route("/apply/verify", handleVerificationCallback),
      route("/apply/verify/success", VerifySuccess),
      route("/apply/verify/error", VerifyError),
    ]),
    // Authentication in production handled by Cloudflare One Access policies
    layout(AdminLayout, [
      route("/admin/applications", [requireCloudflareAccess(), AdminApplications]),
      route("/admin/applications/:id", [
        requireCloudflareAccess(),
        ({ params }) => <AdminApplicationDetail id={params.id} />,
      ]),
    ]),
    layout(Layout, [route("/*", NotFound)]),
  ]),
]);

export default {
  fetch: app.fetch,
  async queue(batch: MessageBatch) {
    if (batch.queue === "agentcribs-process-application") {
      for (const message of batch.messages) {
        const payload = message.body as ApplicationPayload;
        await handleProcessApplication(payload);
        message.ack();
      }
    } else if (batch.queue === "agentcribs-send-email") {
      for (const message of batch.messages) {
        const payload = message.body as {
          type: "application" | "update";
          email: string;
          token: string;
          applicationId: string;
        };
        await handleSendEmail(payload);
        message.ack();
      }
    } else if (batch.queue === "agentcribs-notifications") {
      for (const message of batch.messages) {
        const payload = message.body as {
          type: "pending-review" | "accepted" | "rejected";
          email: string;
          name: string;
          applicationId: string;
        };
        await handleSendNotification(payload);
        message.ack();
      }
    } else if (batch.queue === "agentcribs-slack") {
      for (const message of batch.messages) {
        const payload = message.body as {
          type: "pending-review" | "accepted" | "rejected";
          email: string;
          name: string;
          applicationId: string;
        };
        await handleSendSlack(payload);
        message.ack();
      }
    }
  },
} satisfies ExportedHandler<Env>;
