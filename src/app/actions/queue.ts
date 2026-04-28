import { env } from "cloudflare:workers";
import {
  sendMagicLink,
  sendPendingReviewEmail,
  sendAdminNotificationEmail,
  sendAcceptedEmail,
  sendRejectedEmail,
} from "@/app/actions/email";
import {
  kvKey,
  emailIndexKey,
  R2_KEY_PREFIX,
  r2Meta,
} from "@/app/actions/application";
import type {
  ApplicationData,
  ApplicationPayload,
} from "@/app/actions/application";

function sendEmailFrom() {
  return env.SEND_EMAIL_FROM || "agentcribs@agentcribs.com";
}

async function sendSlackNotification(text: string): Promise<void> {
  const webhook = env.SLACK_WEBHOOK_URL;
  if (!webhook) return;

  const response = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    console.error(
      `[queue/notification] Slack notification failed: ${response.status}`,
    );
  }
}

export async function handleProcessApplication(
  payload: ApplicationPayload,
): Promise<void> {
  const { kvKey: applicationKvKey, email, token, isUpdate } = payload;

  // Fetch the application from KV
  const raw = await env.AGENTCRIBS_KV.get(applicationKvKey);
  if (!raw) {
    console.error(
      `[queue/process] Application not found in KV: ${applicationKvKey}`,
    );
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

  console.log(
    `[queue/process] Application ${application.id} processed, email queued`,
  );
}

export async function handleSendEmail(payload: {
  type: "application" | "update";
  email: string;
  token: string;
  applicationId: string;
}): Promise<void> {
  const { email, token } = payload;

  console.log(`[queue/email] Sending magic link to ${email}`);

  const baseUrl = env.APP_URL || "http://localhost:5173";

  // Properly await email delivery — no fire-and-forget
  await sendMagicLink({
    sendEmail: env.SEND_EMAIL,
    from: sendEmailFrom(),
    baseUrl,
    email,
    token,
  });

  console.log(`[queue/email] Magic link sent to ${email}`);
}

export async function handleSendNotification(payload: {
  type: "pending-review" | "accepted" | "rejected";
  email: string;
  name: string;
}): Promise<void> {
  const { type, email, name } = payload;

  if (type === "pending-review") {
    console.log(
      `[queue/notification] Sending pending-review email to ${email}`,
    );
    await sendPendingReviewEmail({
      sendEmail: env.SEND_EMAIL,
      from: sendEmailFrom(),
      email,
      name,
    });
    // Also notify admin
    await sendAdminNotificationEmail({
      sendEmail: env.SEND_EMAIL,
      from: sendEmailFrom(),
      name,
      email,
    });
  } else if (type === "accepted") {
    console.log(`[queue/notification] Sending accepted email to ${email}`);
    await sendAcceptedEmail({
      sendEmail: env.SEND_EMAIL,
      from: sendEmailFrom(),
      email,
      name,
    });
  } else if (type === "rejected") {
    console.log(`[queue/notification] Sending rejected email to ${email}`);
    await sendRejectedEmail({
      sendEmail: env.SEND_EMAIL,
      from: sendEmailFrom(),
      email,
      name,
    });
  }

  console.log(`[queue/notification] ${type} email sent to ${email}`);
}
