export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[900px] flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row sm:px-8">
        <p className="text-sm leading-relaxed text-text-secondary">
          AgentCribs is a{" "}
          <a href="https://pwv.com" className="font-medium text-text underline decoration-border underline-offset-2 transition-colors hover:text-accent">
            PWV
          </a>{" "}
          community project.
        </p>
        <div className="flex items-center gap-6">
          <a href="mailto:agentcribs@pwv.com" className="text-sm text-text-secondary no-underline underline-offset-2 transition-colors hover:text-text hover:underline">
            agentcribs@pwv.com
          </a>
        </div>
      </div>
    </footer>
  );
}
