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
import { getAppUrl } from "@/app/lib/url";
import { db } from "@/db/db";
import { accounts, profiles, documents } from "@/db/schema";
import { eq } from "drizzle-orm";

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

  const baseUrl = getAppUrl(env.APP_URL);

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
    const baseUrl = getAppUrl(env.APP_URL);
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
    const baseUrl = getAppUrl(env.APP_URL);
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

  const baseUrl = getAppUrl(env.APP_URL);
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

/** Queue consumer: backfill a single application into an account. */
export async function handleBackfillAccount(message: Message): Promise<void> {
  const payload = message.body as { applicationId: string };
  const { applicationId } = payload;

  console.log(
    `[queue/backfill] Starting backfill for application ${applicationId}`,
  );

  const appRaw = await env.AGENTCRIBS_KV.get(kvKey(applicationId));
  if (!appRaw) {
    console.error(
      `[queue/backfill] Application not found in KV: ${applicationId}`,
    );
    throw new Error(`Application not found: ${applicationId}`);
  }

  const app = JSON.parse(appRaw);
  if (app.accountId) {
    const [accountExists] = await db
      .select({ id: accounts.id })
      .from(accounts)
      .where(eq(accounts.id, app.accountId))
      .limit(1);
    if (accountExists) {
      console.log(
        `[queue/backfill] Skipping ${applicationId} — already has account ${app.accountId}`,
      );
      return;
    }
    console.log(
      `[queue/backfill] Stale accountId ${app.accountId} on ${applicationId} — account doesn't exist in D1, proceeding with backfill`,
    );
  }

  const email = app.email;
  const name = `${app.firstName} ${app.lastName}`;

  const [existing] = await db
    .select({ id: accounts.id })
    .from(accounts)
    .where(eq(accounts.email, email))
    .limit(1);

  let accountId: string;
  if (existing) {
    accountId = existing.id;
    console.log(
      `[queue/backfill] Found existing account ${accountId} for ${email}`,
    );
  } else {
    const [created] = await db
      .insert(accounts)
      .values({ email })
      .returning({ id: accounts.id });
    accountId = created.id;
    console.log(
      `[queue/backfill] Created account ${accountId} for ${email}`,
    );
  }

  const now = new Date().toISOString();
  await db
    .insert(profiles)
    .values({
      account_id: accountId,
      first_name: app.firstName ?? null,
      last_name: app.lastName ?? null,
      github_handle: app.githubHandle ?? null,
      github_id: app.githubId ?? null,
      avatar_url: app.githubAvatarUrl ?? null,
      updated_at: now,
    })
    .onConflictDoUpdate({
      target: profiles.account_id,
      set: {
        first_name: app.firstName ?? null,
        last_name: app.lastName ?? null,
        github_handle: app.githubHandle ?? null,
        github_id: app.githubId ?? null,
        avatar_url: app.githubAvatarUrl ?? null,
        updated_at: now,
      },
    });

  app.accountId = accountId;
  app.updatedAt = now;
  const serialized = JSON.stringify(app);
  const docR2Key = `accounts/${accountId}/documents/${applicationId}.json`;

  await Promise.all([
    env.AGENTCRIBS_KV.put(kvKey(applicationId), serialized),
    env.AGENTCRIBS_R2.put(
      `applications/${applicationId}.json`,
      serialized,
      r2Meta(app),
    ),
    env.AGENTCRIBS_R2.put(docR2Key, serialized, {
      httpMetadata: { contentType: "application/json" },
    }),
    db.insert(documents).values({
      account_id: accountId,
      application_id: applicationId,
      document_type: "application",
      filename: `application-${applicationId}.json`,
      content_type: "application/json",
      size_bytes: new TextEncoder().encode(serialized).length,
      r2_key: docR2Key,
    }),
  ]);

  console.log(
    `[queue/backfill] Done: ${applicationId} → account ${accountId}`,
  );
}

/** Enqueue all applications without accounts for backfill processing. */
export async function enqueueBackfillJobs(): Promise<number> {
  const KV_PREFIX = "app:";
  const list = await env.AGENTCRIBS_KV.list({ prefix: KV_PREFIX });

  console.log(
    `[queue/backfill] KV list returned ${list.keys.length} keys with prefix "${KV_PREFIX}"`,
  );

  if (list.keys.length === 0) return 0;

  const results = await Promise.all(
    list.keys.map((key) => env.AGENTCRIBS_KV.get(key.name)),
  );

  const allApps = results
    .filter((r): r is string => r !== null)
    .map((r) => JSON.parse(r));

  const existingAccountRows = await db
    .select({ id: accounts.id })
    .from(accounts)
    .all();
  const existingAccountIds = new Set(existingAccountRows.map((a) => a.id));

  const needsBackfill = (app: { accountId?: string }) =>
    !app.accountId || !existingAccountIds.has(app.accountId);

  const withoutAccounts = allApps.filter(
    (a: { accountId?: string }) => !a.accountId,
  ).length;
  const withStaleRefs = allApps.filter(
    (a: { accountId?: string }) => a.accountId && !existingAccountIds.has(a.accountId),
  ).length;

  console.log(
    `[queue/backfill] Fetched ${allApps.length} applications, ${withoutAccounts} without accounts, ${withStaleRefs} with stale account refs`,
  );

  const toBackfill = allApps.filter(needsBackfill);

  console.log(
    `[queue/backfill] Enqueuing ${toBackfill.length} applications for backfill`,
  );

  for (const app of toBackfill) {
    await env.BACKFILL_ACCOUNTS_QUEUE.send({
      applicationId: app.id,
    });
  }

  console.log(
    `[queue/backfill] Enqueued ${toBackfill.length} backfill jobs`,
  );

  return toBackfill.length;
}
