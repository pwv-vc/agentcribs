import styles from "./styles.css?url";

export const Document: React.FC<{
  children: React.ReactNode;
  rw: { nonce: string };
}> = ({ children, rw }) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#f7f1dc" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#090907" media="(prefers-color-scheme: dark)" />

      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=5" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico?v=5" sizes="any" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png?v=5" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png?v=5" />
      <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png?v=5" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=5" />
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
              document.documentElement.classList.toggle("dark", window.matchMedia("(prefers-color-scheme: dark)").matches);
            })();
          `,
        }}
      />
      <script>import("/src/client.tsx")</script>
    </body>
  </html>
);
