'use client';

import { type ReactNode, useState, useEffect } from 'react';
import { ConsentManagerProvider, ConsentBanner, ConsentDialog } from '@c15t/react';
import { DevTools } from '@c15t/dev-tools/react';

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
    <ConsentManagerProvider
      options={{
        mode: 'hosted',
        backendURL: '/api/c15t',
        consentCategories: ['necessary', 'measurement', 'marketing'],
        colorScheme: 'system',
        legalLinks: {
          privacyPolicy: { href: 'https://agentcribs.com/privacy' },
          termsOfService: { href: 'https://agentcribs.com/terms' },
        },
        theme: {
          colors: {
            primary: '#006f1b',
            primaryHover: '#005a16',
            surface: '#ffffff',
            surfaceHover: '#f7f1dc',
            text: '#000000',
            textMuted: '#303027',
            textOnPrimary: '#050505',
            border: '#d9d9d9',
            switchTrack: '#e4e4e4',
            switchTrackActive: '#00d22e',
            switchThumb: '#ffffff',
            overlay: 'rgba(0, 0, 0, 0.5)',
          },
          dark: {
            primary: '#04d936',
            primaryHover: '#58f06f',
            surface: '#0a0a0a',
            surfaceHover: '#111111',
            text: '#f7f2df',
            textMuted: '#d7d0bb',
            textOnPrimary: '#050505',
            border: '#303027',
            switchTrack: '#111111',
            switchTrackActive: '#04d936',
            switchThumb: '#ffffff',
            overlay: 'rgba(0, 0, 0, 0.7)',
          },
          radius: {
            sm: '0.375rem',
            md: '0.5rem',
            lg: '0.75rem',
            full: '9999px',
          },
          spacing: {
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem',
          },
          typography: {
            fontFamily:
              '"DM Sans Variable", Inter, system-ui, -apple-system, sans-serif',
            fontWeight: {
              normal: 400,
              medium: 500,
              semibold: 600,
            },
          },
          consentActions: {
            default: { mode: 'stroke' },
            accept: { variant: 'primary', mode: 'filled' },
            customize: { variant: 'neutral', mode: 'ghost' },
          },
          slots: {
            consentBannerCard: 'shadow-xl rounded-xl max-w-[440px]',
            consentBannerFooter: 'border-t border-border',
            consentBannerTitle: 'text-lg font-semibold',
          },
        },
      }}
    >
      <ConsentBanner layout={['customize', ['reject', 'accept']]} primaryButton="accept" />
      <ConsentDialog />
      {isDev && <DevTools />}
      {children}
    </ConsentManagerProvider>
  );
}
