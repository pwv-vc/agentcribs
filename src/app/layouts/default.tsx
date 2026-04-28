import { Header } from "@/app/shared/header";
import { Footer } from "@/app/shared/footer";

export function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
