import { Header } from "@/app/shared/header";
import { Footer } from "@/app/shared/footer";
import { ConsentManagerProviderClient } from "@/app/components/consent-manager/provider";

export function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <ConsentManagerProviderClient>
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">{children}</main>

        <Footer />
      </div>
    </ConsentManagerProviderClient>
  );
}
