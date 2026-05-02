import { Header } from "@/app/shared/header";
import { Footer } from "@/app/shared/footer";
import { ConsentManager } from "@/app/components/consent-manager";

export function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <ConsentManager>
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">{children}</main>

        <Footer />
      </div>
    </ConsentManager>
  );
}
