"use client";

import { type ReactNode } from "react";
import {
  ConsentManagerProvider,
  ConsentBanner,
  ConsentDialog,
} from "@c15t/react";
import { DevTools } from "@c15t/dev-tools/react";
import { consentOptions } from "./consent.config";

const isDev =
  import.meta.env.DEV || import.meta.env.VITE_IS_DEV_SERVER === "true";

export function ConsentManagerProviderClient({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConsentManagerProvider options={consentOptions}>
      <ConsentBanner
        layout={["customize", ["reject", "accept"]]}
        primaryButton="accept"
      />
      <ConsentDialog />
      {isDev && <DevTools />}
      {children}
    </ConsentManagerProvider>
  );
}
