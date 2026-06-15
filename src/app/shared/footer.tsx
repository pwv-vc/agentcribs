import { SemverFlourish } from "@/app/shared/semver-flourish";
import { FooterLink } from "@/app/components/links";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-[1040px] px-6 py-10 sm:px-8 sm:py-14">
        <SemverFlourish />
      </div>
      <div className="mx-auto flex max-w-[900px] flex-col items-center justify-between gap-4 border-t border-border px-6 py-8 sm:flex-row sm:px-8">
        <p className="text-sm leading-relaxed text-text-secondary">
          &copy; 2026 PWV. AgentCribs is a{" "}
          <a href="https://pwv.com" className="font-medium text-text underline decoration-border underline-offset-2 transition-colors hover:text-accent">
            PWV
          </a>{" "}
          community project.
        </p>
        <div className="flex items-center gap-6">
          <FooterLink href="/terms">Terms</FooterLink>
          <FooterLink href="/privacy">Privacy</FooterLink>
        </div>
      </div>
    </footer>
  );
}
