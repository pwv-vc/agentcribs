import { layout, render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";

import { Document } from "@/app/document";
import { setCommonHeaders } from "@/app/headers";
import { Layout } from "@/app/layouts/default";
import { AdminLayout } from "@/app/layouts/admin";
import { requireAdminPassword } from "@/app/middleware/auth/basic";
import { handleGitHubCallback } from "@/app/middleware/github/callback";
import { handleVerificationCallback } from "@/app/middleware/verify/callback";
import { AdminApplications } from "@/app/pages/admin/applications";
import { AdminApplicationDetail } from "@/app/pages/admin/application";
import { Apply } from "@/app/pages/apply";
import { ThankYou } from "@/app/pages/thank-you";
import { VerifySuccess } from "@/app/pages/verify-success";
import { VerifyError } from "@/app/pages/verify-error";
import { Home } from "@/app/pages/home";

export type AppContext = {};

const adminAuth = requireAdminPassword();

export default defineApp([
  setCommonHeaders(),
  ({ ctx }) => {
    // setup ctx here
    ctx;
  },
  render(Document, [
    ...layout(Layout, [
      route("/", Home),
      route("/apply", Apply),
      route("/apply/thank-you", ThankYou),
      route("/apply/github/callback", handleGitHubCallback),
      route("/apply/verify", handleVerificationCallback),
      route("/apply/verify/success", VerifySuccess),
      route("/apply/verify/error", VerifyError),
    ]),
    ...layout(AdminLayout, [
      route("/admin/applications", [adminAuth, AdminApplications]),
      route("/admin/applications/:id", [
        adminAuth,
        ({ params }) => <AdminApplicationDetail id={params.id} />,
      ]),
    ]),
  ]),
]);
