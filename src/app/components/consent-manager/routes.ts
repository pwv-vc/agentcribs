import { route } from "rwsdk/router";
import { handleC15tRewrite } from "@/app/middleware/c15t/rewrite";

export const c15tRoutes = [
  route("/", handleC15tRewrite),
  route("/*", handleC15tRewrite),
];
