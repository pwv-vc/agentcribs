import { env } from "cloudflare:workers";
import type { RouteMiddleware } from "rwsdk/router";

const SESSION_VALUE = "authenticated";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

function getCookieName() {
  return env.ADMIN_COOKIE_NAME || "agentcribs-dev-admin_session";
}

export const requireAdminPassword = (): RouteMiddleware => {
  return (requestInfo) => {
    const url = new URL(requestInfo.request.url);
    const cookies = parseCookies(requestInfo.request);

    // Already authenticated — pass through
    if (cookies[getCookieName()] === SESSION_VALUE) {
      return;
    }

    const adminPassword = env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return;
    }

    // Handle POST — validate password and set cookie
    if (requestInfo.request.method === "POST") {
      return handleLogin(requestInfo.request, adminPassword, url.pathname);
    }

    // Show login form
    return new Response(
      renderLoginForm(),
      {
        status: 401,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      },
    );
  };
};

async function handleLogin(request: Request, adminPassword: string, redirectTo: string) {
  const formData = await request.formData();
  const password = formData.get("password") as string;

  if (password !== adminPassword) {
    return new Response(
      renderLoginForm("Incorrect password."),
      {
        status: 401,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      },
    );
  }

  const cookie = `${getCookieName()}=${SESSION_VALUE}; Path=/admin; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`;
  return new Response(null, {
    status: 303,
    headers: {
      Location: redirectTo,
      "Set-Cookie": cookie,
    },
  });
}

function parseCookies(request: Request): Record<string, string> {
  const cookieHeader = request.headers.get("Cookie") || "";
  const result: Record<string, string> = {};
  for (const part of cookieHeader.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const key = part.slice(0, eq).trim();
    const value = part.slice(eq + 1).trim();
    if (key) result[key] = value;
  }
  return result;
}

function renderLoginForm(error?: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Admin Login — AgentCribs</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: system-ui, sans-serif;
    background: #0d0d0d;
    color: #e5e5e5;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .card {
    background: #1a1a1a;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 32px;
    width: 100%;
    max-width: 360px;
  }
  h1 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 4px;
  }
  p { font-size: 0.875rem; color: #8f8d86; margin-bottom: 20px; }
  input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 8px;
    background: #0d0d0d;
    color: #e5e5e5;
    font-size: 0.9rem;
    margin-bottom: 12px;
  }
  input:focus { outline: none; border-color: #85ffa0; }
  button {
    width: 100%;
    padding: 10px 14px;
    border: none;
    border-radius: 8px;
    background: #85ffa0;
    color: #000;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
  }
  button:hover { background: #a8ffc0; }
  .error { color: #ffc4c4; font-size: 0.8rem; margin-bottom: 12px; }
</style>
</head>
<body>
<div class="card">
  <h1>Admin Login</h1>
  <p>Enter the admin password to continue.</p>
  ${error ? `<div class="error">${error}</div>` : ""}
  <form method="post">
    <input type="password" name="password" placeholder="Password" autofocus />
    <button type="submit">Sign in</button>
  </form>
</div>
</body>
</html>`;
}
