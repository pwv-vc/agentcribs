import { layout, render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";

import { Document } from "@/app/document";
import { setCommonHeaders } from "@/app/headers";
import { Layout } from "@/app/layouts/default";
import { AdminLayout } from "@/app/layouts/admin";
import { requireAdminPassword } from "@/app/middleware/auth/basic";
import { AdminApplications } from "@/app/pages/admin/applications";
import { AdminApplicationDetail } from "@/app/pages/admin/application";
import { Apply } from "@/app/pages/apply";
import { ThankYou } from "@/app/pages/thank-you";
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
