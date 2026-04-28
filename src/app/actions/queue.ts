import { env } from "cloudflare:workers";
import { sendMagicLink } from "@/app/actions/email";
import { kvKey, emailIndexKey, R2_KEY_PREFIX, r2Meta } from "@/app/actions/application";
import type { ApplicationData, ApplicationPayload } from "@/app/actions/application";

export async function handleProcessApplication(payload: ApplicationPayload): Promise<void> {
  const { kvKey: applicationKvKey, email, token, isUpdate } = payload;

  // Fetch the application from KV
  const raw = await env.AGENTCRIBS_KV.get(applicationKvKey);
  if (!raw) {
    console.error(`[queue/process] Application not found in KV: ${applicationKvKey}`);
    return;
  }

  const application: ApplicationData = JSON.parse(raw);

  // Save to R2 for durable backup
  await env.AGENTCRIBS_R2.put(
    `${R2_KEY_PREFIX}${application.id}.json`,
    raw,
    r2Meta(application),
  );

  // Set email index
  await env.AGENTCRIBS_KV.put(emailIndexKey(email), application.id);

  // Enqueue the email task
  await env.SEND_EMAIL_QUEUE.send({
    type: isUpdate ? "update" : "application",
    email,
    token,
    applicationId: application.id,
  });

  console.log(`[queue/process] Application ${application.id} processed, email queued`);
}

export async function handleSendEmail(payload: {
  type: "application" | "update";
  email: string;
  token: string;
  applicationId: string;
}): Promise<void> {
  const { email, token } = payload;

  console.log(`[queue/email] Sending magic link to ${email}`);

  // Properly await email delivery — no fire-and-forget
  await sendMagicLink({ email, token });

  console.log(`[queue/email] Magic link sent to ${email}`);
}
