import { layout, prefix, render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";
import { defineDurableSession } from "rwsdk/auth";

import { Document } from "@/app/document";
import { requestFirewall } from "@/app/interrupters/request-firewall";
import { cloudflareSessionMiddleware } from "@/app/middleware/cloudflare-session";
import { accountSessionMiddleware } from "@/app/middleware/account-session";
import { handleAccountVerification } from "@/app/middleware/account/verify";
import { handleAccountLogout } from "@/app/middleware/account/logout";
import { C15T_ROUTE_PREFIX } from "@/app/shared/c15t";
import { c15tRoutes } from "@/app/components/consent-manager/routes";
import { setCommonHeaders } from "@/app/headers";
import { Layout } from "@/app/layouts/default";
import { AdminLayout } from "@/app/layouts/admin";
import { AccountLayout } from "@/app/layouts/account";
import { AuthLayout } from "@/app/layouts/auth";
import { initSessionStore } from "@/app/lib/session";
import { handleDownloadR2 } from "@/app/middleware/download/r2";
import { handleDocumentDownload } from "@/app/middleware/download/document";
import { handleGitHubCallback } from "@/app/middleware/github/callback";
import { handleVerificationCallback } from "@/app/middleware/verify/callback";
import { AdminApplications } from "@/app/pages/admin/applications";
import { AdminDashboard } from "@/app/pages/admin/dashboard";
import { AdminApplicationDetail } from "@/app/pages/admin/application";
import { AdminApplicationEditPage } from "@/app/pages/admin/application-edit-page";
import { AdminEvents } from "@/app/pages/admin/events";
import { AdminEventDetail } from "@/app/pages/admin/event";
import { AdminAccounts } from "@/app/pages/admin/accounts";
import { Apply } from "@/app/pages/apply";
import { ThankYou } from "@/app/pages/thank-you";
import { VerifySuccess } from "@/app/pages/verify-success";
import { VerifyError } from "@/app/pages/verify-error";
import { Terms } from "@/app/pages/terms";
import { Privacy } from "@/app/pages/privacy";
import { Home } from "@/app/pages/home";
import { NotFound } from "@/app/pages/not-found";
import { LoginPage } from "@/app/pages/login";
import { ProfilePage } from "@/app/pages/profile";
import { DocumentDetailPage } from "@/app/pages/document-detail";
import { UserSession } from "@/sessions/UserSession";
import {
  handleProcessApplication,
  handleSendEmail,
  handleSendNotification,
  handleSendSlack,
  handleDeadLetter,
  handleBackfillAccount,
  handleAccountLoginMagicLink,
  processRetries,
} from "@/app/actions/queue";
import type { ApplicationPayload } from "@/app/actions/application";
import { env } from "cloudflare:workers";

export type AppContext = {
  session?: {
    email?: string;
    sub?: string;
    accountId?: string;
    avatarUrl?: string;
  };
  devEmail?: string;
  flash?: { message: string };
};

const sessionStore = defineDurableSession({
  sessionDurableObject: env.USER_SESSION_DO,
  cookieName:
    import.meta.env.DEV || import.meta.env.VITE_IS_DEV_SERVER === "true"
      ? "agentcribs-session"
      : "__Host-agentcribs-session",
});
initSessionStore(sessionStore);

export const app = defineApp([
  requestFirewall,
  setCommonHeaders(),
  prefix(C15T_ROUTE_PREFIX, c15tRoutes),
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
      route("/me", () => new Response(null, {
        status: 302,
        headers: { Location: "/my/profile" },
      })),
    ]),
    layout(AuthLayout, [
      // Public account auth routes
      route("/login", ({ request }) => {
        const url = new URL(request.url);
        const sent = url.searchParams.get("sent") === "true";
        const expired = url.searchParams.get("expired") === "true";
        return <LoginPage sent={sent} expired={expired} />;
      }),
      route("/login/verify", handleAccountVerification),
      route("/logout", handleAccountLogout),
    ]),
    // Authentication in production handled by Cloudflare One Access policies
    // but we will try to populate the session with the authenticated user's email
    layout(AdminLayout, [
      cloudflareSessionMiddleware,
      route("/admin/applications/download", handleDownloadR2),
      route("/admin/dashboard", AdminDashboard),
      route("/admin/applications", AdminApplications),
      route("/admin/applications/:id", ({ params }) => (
        <AdminApplicationDetail id={params.id} />
      )),
      route("/admin/applications/:id/edit", ({ params }) => (
        <AdminApplicationEditPage id={params.id} />
      )),
      route("/admin/events", ({ request }) => (
        <AdminEvents request={request} />
      )),
      route("/admin/events/:id", ({ params, request }) => (
        <AdminEventDetail id={params.id} request={request} />
      )),
      route("/admin/accounts", AdminAccounts),
    ]),
    // Applicant account routes — /my/* protected by session cookie
    layout(AccountLayout, [
      accountSessionMiddleware,
      route("/my/profile", ProfilePage),
      route("/my/documents/:id", ({ params, ctx }) => (
        <DocumentDetailPage id={params.id} ctx={ctx} />
      )),
    ]),
    // Document download — uses account auth
    layout(AccountLayout, [
      accountSessionMiddleware,
      route("/my/documents/:id/download", handleDocumentDownload),
    ]),
    layout(Layout, [route("/*", NotFound)]),
  ]),
]);

export { UserSession };

export default {
  fetch: app.fetch,
  async queue(batch: MessageBatch) {
    if (batch.queue === "agentcribs-process-application") {
      await processRetries(batch.queue, batch.messages, async (message) => {
        const payload = message.body as ApplicationPayload;
        await handleProcessApplication(payload);
      });
    } else if (batch.queue === "agentcribs-send-email") {
      await processRetries(batch.queue, batch.messages, async (message) => {
        const payload = message.body as {
          type: "application" | "update";
          email: string;
          token: string;
          applicationId: string;
        };
        await handleSendEmail(payload);
      });
    } else if (batch.queue === "agentcribs-notifications") {
      await processRetries(batch.queue, batch.messages, async (message) => {
        const payload = message.body as {
          type: "pending-review" | "accepted" | "rejected";
          email: string;
          name: string;
          applicationId: string;
        };
        await handleSendNotification(payload);
      });
    } else if (batch.queue === "agentcribs-slack") {
      await processRetries(batch.queue, batch.messages, async (message) => {
        const payload = message.body as {
          type: "pending-review" | "accepted" | "rejected";
          email: string;
          name: string;
          applicationId: string;
        };
        await handleSendSlack(payload);
      });
    } else if (batch.queue === "agentcribs-dead-letter") {
      for (const message of batch.messages) {
        const payload = message.body as {
          queue: string;
          error: string;
          body: unknown;
        };
        await handleDeadLetter(payload);
        message.ack();
      }
    } else if (batch.queue === "agentcribs-backfill-accounts") {
      await processRetries(batch.queue, batch.messages, handleBackfillAccount);
    } else if (batch.queue === "agentcribs-account-login") {
      await processRetries(batch.queue, batch.messages, async (message) => {
        const payload = message.body as { email: string; token: string };
        await handleAccountLoginMagicLink(payload);
      });
    }
  },
} satisfies ExportedHandler<Env>;
