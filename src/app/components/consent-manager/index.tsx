import type { ReactNode } from 'react';
import { ConsentManagerProviderClient } from './provider';

export function ConsentManager({ children }: { children: ReactNode }) {
  return <ConsentManagerProviderClient>{children}</ConsentManagerProviderClient>;
}
