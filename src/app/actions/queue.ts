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

function sendEmailFrom(): EmailAddress {
  if (env.SEND_EMAIL_FROM) {
    return { name: "David from AgentCribs", email: env.SEND_EMAIL_FROM };
  }
  return { name: "David from AgentCribs", email: "apply@agentcribs.com" };
}

async function sendSlackNotification(body: string): Promise<void> {
  const webhook = env.SLACK_WEBHOOK_URL;
  if (!webhook) return;

  const response = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (!response.ok) {
    console.error(
      `[queue/notification] Slack notification failed: ${response.status}`,
    );
    throw new Error(
      `Slack notification failed with status ${response.status}`,
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
    throw new Error(
      `Application not found in KV: ${applicationKvKey}`,
    );
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
  applicationId: string;
}): Promise<void> {
  const { type, email, name, applicationId } = payload;

  console.log(
    `[queue/notification] Starting: type=${type} email=${email} name=${name} appId=${applicationId}`,
  );

  if (type === "pending-review") {
    // Fetch application data from KV for richer email content
    const appRaw = await env.AGENTCRIBS_KV.get(kvKey(applicationId));
    const app: ApplicationData | null = appRaw ? JSON.parse(appRaw) : null;

    const topics = app?.topics;
    const story = app?.story;
    const summary = app?.summary;
    const howHeard = app?.howHeard;
    const location = app?.location;

    console.log(
      `[queue/notification] Sending pending-review email to ${email}`,
    );
    await sendPendingReviewEmail({
      sendEmail: env.SEND_EMAIL,
      from: sendEmailFrom(),
      email,
      name,
      topics,
      story,
      summary,
      howHeard,
      location,
    });
    // Also notify admin
    const baseUrl = env.APP_URL || "https://agentcribs.com";
    await sendAdminNotificationEmail({
      sendEmail: env.SEND_EMAIL,
      from: sendEmailFrom(),
      name,
      email,
      applicationUrl: `${baseUrl}/admin/applications/${applicationId}`,
      story,
      summary,
      topics,
      howHeard,
      location,
    });
  } else if (type === "accepted") {
    console.log(`[queue/notification] Sending accepted email to ${email}`);
    const baseUrl = env.APP_URL || "https://agentcribs.com";
    await sendAcceptedEmail({
      sendEmail: env.SEND_EMAIL,
      from: sendEmailFrom(),
      email,
      name,
      baseUrl,
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

  // Send Slack notification as a separate queue message
  console.log(
    `[queue/notification] Enqueuing Slack notification for ${applicationId}`,
  );
  await env.SLACK_QUEUE.send({
    type,
    email,
    name,
    applicationId,
  });

  console.log(`[queue/notification] Done: ${type} email sent to ${email}`);
}

export async function handleSendSlack(payload: {
  type: "pending-review" | "accepted" | "rejected";
  email: string;
  name: string;
  applicationId: string;
}): Promise<void> {
  const { type, email, name, applicationId } = payload;

  console.log(
    `[queue/slack] Starting: type=${type} name=${name} appId=${applicationId}`,
  );

  const baseUrl = env.APP_URL || "https://agentcribs.com";
  const appUrl = `${baseUrl}/admin/applications/${applicationId}`;

  const appRaw = await env.AGENTCRIBS_KV.get(kvKey(applicationId));
  if (!appRaw) {
    console.error(
      `[queue/slack] Application not found in KV: ${applicationId}`,
    );
    throw new Error(
      `Application not found in KV for Slack notification: ${applicationId}`,
    );
  }

  const app: ApplicationData = JSON.parse(appRaw);
  const org = app.organization || "no org";
  const topics = app.topics?.length ? app.topics.join(", ") : null;
  const howHeard = app.howHeard;
  const location = app.location;

  const blocks: Record<string, unknown>[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `📝 ${type === "pending-review" ? "New" : type === "accepted" ? "Accepted" : "Rejected"} Application`,
      },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Name:*\n${name}` },
        { type: "mrkdwn", text: `*Email:*\n<mailto:${email}|${email}>` },
        { type: "mrkdwn", text: `*Organization:*\n${org}` },
        { type: "mrkdwn", text: `*Location:*\n${location || "—"}` },
        { type: "mrkdwn", text: `*Status:*\n${app.status}` },
      ],
    },
  ];

  if (location) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*Location:*\n${location}` },
    });
  }

  if (howHeard) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*How Heard:*\n${howHeard}` },
    });
  }

  if (topics) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*Topics:*\n${topics}` },
    });
  }

  if (app.story) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*Story:*\n${app.story}` },
    });
  }

  if (app.summary) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*AI Summary:*\n_${app.summary}_` },
    });
  }

  // Use a link in context rather than an actions button to avoid needing Slack app interactivity
  blocks.push({
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: `<${appUrl}|Review in AgentCribs>`,
      },
    ],
  });

  const slackPayload = { blocks, text: `${type}: ${name} (${org})` };

  console.log(`[queue/slack] Posting to Slack`);
  await sendSlackNotification(JSON.stringify(slackPayload));
  console.log(
    `[queue/slack] Done: Slack notification sent for ${applicationId}`,
  );
}

async function sendSlackBody(body: string): Promise<void> {
  if (!env.SLACK_WEBHOOK_URL) return;
  const resp = await fetch(env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  if (!resp.ok) {
    console.error(`[queue/dead-letter] Slack alert failed: ${resp.status}`);
  }
}

export async function handleDeadLetter(payload: {
  queue: string;
  error: string;
  body: unknown;
}): Promise<void> {
  const { queue: sourceQueue, error, body } = payload;

  console.error(
    `[queue/dead-letter] Message from ${sourceQueue} failed: ${error}`,
  );

  const slackBody = JSON.stringify({
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "⚠️ Queue Message Failed",
        },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Queue:*\n${sourceQueue}` },
          { type: "mrkdwn", text: `*Error:*\n\`${error}\`` },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Body:*\n\`\`\`${JSON.stringify(body, null, 2).slice(0, 500)}\`\`\``,
        },
      },
    ],
    text: `⚠️ Queue message failed: ${sourceQueue} — ${error}`,
  });

  await sendSlackBody(slackBody);
}

export async function processRetries(
  queueName: string,
  messages: readonly Message[],
  handler: (message: Message) => Promise<void>,
) {
  for (const message of messages) {
    if (message.attempts > 1) {
      console.warn(
        `[queue/${queueName}] Retry attempt ${message.attempts}`,
      );
    }
    try {
      await handler(message);
    } catch (err) {
      console.error(
        `[queue/${queueName}] Failed: ${err instanceof Error ? err.message : String(err)}`,
      );
      await env.DEAD_LETTER_QUEUE.send({
        queue: queueName,
        error: err instanceof Error ? err.message : String(err),
        body: message.body,
      });
    }
    message.ack();
  }
}
