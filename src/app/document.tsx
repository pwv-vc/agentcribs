import styles from "./styles.css?url";

export const Document: React.FC<{
  children: React.ReactNode;
  rw: { nonce: string };
}> = ({ children, rw }) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
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
