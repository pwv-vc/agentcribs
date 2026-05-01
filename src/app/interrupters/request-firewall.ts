/**
 * Blocks probing requests from bots, scanners, and legacy CMS exploit tools.
 * Returns a fast 404 with a long cache header so the CDN remembers.
 */
export const requestFirewall = ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const path = url.pathname.toLowerCase();

  const blocked =
    // WordPress / CMS junk
    path.startsWith("/wp-") ||
    path.includes("/wordpress") ||
    path.includes("/drupal") ||
    path.includes("/joomla") ||
    // PHP probing
    path.endsWith(".php") ||
    path.includes(".php/") ||
    // Sensitive files
    path === "/.env" ||
    path.endsWith(".env") ||
    path.includes(".env.") ||
    path.includes("/.git") ||
    path.includes("/.svn") ||
    // Common exploit targets
    path === "/xmlrpc.php" ||
    path === "/wlwmanifest.xml" ||
    path === "/.htaccess" ||
    path === "/.htpasswd" ||
    // Config / backups / dumps
    path.endsWith(".sql") ||
    path.endsWith(".bak") ||
    path.endsWith(".old") ||
    path.endsWith(".backup") ||
    path.endsWith(".zip") ||
    path.endsWith(".tar") ||
    path.endsWith(".gz") ||
    // Admin panels you don't have
    path.includes("/phpmyadmin") ||
    path.includes("/pma") ||
    // Env/debug endpoints
    path.includes("/debug") ||
    path.includes("/vendor") ||
    path.includes("/config");

  if (blocked) {
    return new Response("Not found", {
      status: 404,
      headers: {
        "Cache-Control": "public, max-age=86400",
      },
    });
  }
};
