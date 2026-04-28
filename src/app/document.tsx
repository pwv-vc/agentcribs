import styles from "./styles.css?url";

export const Document: React.FC<{
  children: React.ReactNode;
  rw: { nonce: string };
}> = ({ children, rw }) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>AgentCribs &mdash; A community for agentic software builders</title>
      <meta
        name="description"
        content="AgentCribs is a PWV community project for people building the future of agentic software development. Join us in San Francisco on May 6."
      />
      <meta name="theme-color" content="#5a6b5e" />

      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
      <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      <link rel="stylesheet" href={styles} precedence="first" />
      <link rel="modulepreload" href="/src/client.tsx" />
    </head>
    <body className="bg-bg text-text transition-colors duration-200">
      {children}
      <script
        nonce={rw.nonce}
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var stored = localStorage.getItem("theme");
              var theme = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
              document.documentElement.classList.toggle("dark", theme === "dark");
              if (!stored) localStorage.setItem("theme", theme);
            })();
          `,
        }}
      />
      <script>import("/src/client.tsx")</script>
    </body>
  </html>
);
