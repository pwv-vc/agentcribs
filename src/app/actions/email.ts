import { env } from "cloudflare:workers";

export async function sendMagicLink({
  email,
  token,
}: {
  email: string;
  token: string;
}): Promise<void> {
  const baseUrl = env.APP_URL || "http://localhost:5173";
  const verifyUrl = `${baseUrl}/apply/verify?token=${token}`;

  await env.SEND_EMAIL.send({
    from: env.SEND_EMAIL_FROM || "agentcribs@agentcribs.com",
    to: email,
    subject: "Verify your email for AgentCribs",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Verify your email</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0d0d0d; color: #e5e5e5; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #0d0d0d; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background: #1a1a1a; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 32px;">
          <tr>
            <td>
              <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 8px;">
                AgentCribs
              </h1>
              <p style="font-size: 14px; color: #8f8d86; margin: 0 0 24px;">
                Verify your email address to complete your application.
              </p>
              <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background: #85ffa0; color: #000; text-decoration: none; font-weight: 700; font-size: 14px; border-radius: 8px;">
                Verify email
              </a>
              <p style="font-size: 12px; color: #6b6b6b; margin: 24px 0 0;">
                This link expires in 1 hour. If you didn't apply to AgentCribs, you can safely ignore this email.
              </p>
              <p style="font-size: 12px; color: #6b6b6b; margin: 8px 0 0;">
                Or paste this link into your browser: <br />
                <span style="color: #85ffa0;">${verifyUrl}</span>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}
