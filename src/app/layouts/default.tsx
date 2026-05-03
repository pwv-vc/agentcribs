import { Header } from "@/app/shared/header";
import { Footer } from "@/app/shared/footer";
import { ConsentManagerProviderClient } from "@/app/components/consent-manager/provider";

export function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <ConsentManagerProviderClient>{children}</ConsentManagerProviderClient>
      </main>

      <Footer />
    </div>
  );
}
