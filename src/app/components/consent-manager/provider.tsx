'use client';

import { type ReactNode, useState, useEffect } from 'react';
import { ConsentManagerProvider, ConsentBanner, ConsentDialog } from '@c15t/react';
import { DevTools } from '@c15t/dev-tools/react';
import { consentOptions } from './consent.config';

const isDev =
  import.meta.env.DEV || import.meta.env.VITE_IS_DEV_SERVER === "true";

export function ConsentManagerProviderClient({
  children,
}: {
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ConsentManagerProvider options={consentOptions}>
      <ConsentBanner layout={['customize', ['reject', 'accept']]} primaryButton="accept" />
      <ConsentDialog />
      {isDev && <DevTools />}
      {children}
    </ConsentManagerProvider>
  );
}
