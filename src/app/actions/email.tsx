"use client";

import "@react-email/render";
import { render } from "@react-email/render";

import MagicLinkEmail, { magicLinkText } from "@/app/emails/magic-link";
import PendingReviewEmail, { pendingReviewText } from "@/app/emails/pending-review";
import AdminNotificationEmail, { adminNotificationText } from "@/app/emails/admin-notification";
import AcceptedEmail, { acceptedText } from "@/app/emails/accepted";
import RejectedEmail, { rejectedText } from "@/app/emails/rejected";

export async function sendMagicLink({
  sendEmail,
  from,
  baseUrl,
  email,
  token,
}: {
  sendEmail: SendEmail;
  from: string;
  baseUrl: string;
  email: string;
  token: string;
}): Promise<void> {
  const verifyUrl = `${baseUrl}/apply/verify?token=${token}`;

  await sendEmail.send({
    from,
    to: email,
    subject: "Final step for your AgentCribs application",
    text: magicLinkText({ verifyUrl }),
    html: await render(<MagicLinkEmail verifyUrl={verifyUrl} />),
  });
}

export async function sendPendingReviewEmail({
  sendEmail,
  from,
  email,
  name,
  topics,
  story,
  summary,
}: {
  sendEmail: SendEmail;
  from: string;
  email: string;
  name: string;
  topics?: string[];
  story?: string;
  summary?: string;
}): Promise<void> {
  await sendEmail.send({
    from,
    to: email,
    subject: "Your AgentCribs application is under review",
    text: pendingReviewText({ name, topics, story, summary }),
    html: await render(
      <PendingReviewEmail name={name} topics={topics} story={story} summary={summary} />,
    ),
  });
}

export async function sendAdminNotificationEmail({
  sendEmail,
  from,
  name,
  email: applicantEmail,
  applicationUrl,
  story,
  summary,
  topics,
}: {
  sendEmail: SendEmail;
  from: string;
  name: string;
  email: string;
  applicationUrl: string;
  story?: string;
  summary?: string;
  topics?: string[];
}): Promise<void> {
  await sendEmail.send({
    from,
    to: "dt@pwv.com",
    subject: `New AgentCribs application to review: ${name}`,
    text: adminNotificationText({
      name,
      email: applicantEmail,
      applicationUrl,
      story,
      summary,
      topics,
    }),
    html: await render(
      <AdminNotificationEmail
        name={name}
        email={applicantEmail}
        applicationUrl={applicationUrl}
        story={story}
        summary={summary}
        topics={topics}
      />,
    ),
  });
}

export async function sendAcceptedEmail({
  sendEmail,
  from,
  email,
  name,
}: {
  sendEmail: SendEmail;
  from: string;
  email: string;
  name: string;
}): Promise<void> {
  await sendEmail.send({
    from,
    to: email,
    subject: "Welcome to AgentCribs!",
    text: acceptedText({ name }),
    html: await render(<AcceptedEmail name={name} />),
  });
}

export async function sendRejectedEmail({
  sendEmail,
  from,
  email,
  name,
}: {
  sendEmail: SendEmail;
  from: string;
  email: string;
  name: string;
}): Promise<void> {
  await sendEmail.send({
    from,
    to: email,
    subject: "Update on your AgentCribs application",
    text: rejectedText({ name }),
    html: await render(<RejectedEmail name={name} />),
  });
}
