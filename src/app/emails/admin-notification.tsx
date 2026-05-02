import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Link,
  Text,
} from "react-email";
import * as React from "react";

export default function AdminNotificationEmail({
  name,
  email,
  applicationUrl,
  story,
  summary,
  topics,
  howHeard,
  location,
}: {
  name: string;
  email: string;
  applicationUrl: string;
  story?: string;
  summary?: string;
  topics?: string[];
  howHeard?: string;
  location?: string;
}) {
  return (
    <Html>
      <Head />
      <Body style={body}>
        <Container style={container}>
          <Text style={heading}>New Application to Review</Text>
          <Text style={paragraph}>
            <strong>{name}</strong> &mdash;{" "}
            <Link href={`mailto:${email}`} style={linkStyle}>
              {email}
            </Link>
            {location && <>&nbsp;&mdash; {location}</>}
          </Text>

          {topics && topics.length > 0 && (
            <Text style={paragraph}>
              <strong>Topics:</strong> {topics.join(", ")}
            </Text>
          )}

          {howHeard && (
            <Text style={paragraph}>
              <strong>How heard:</strong> {howHeard}
            </Text>
          )}

          {story && (
            <Text style={paragraph}>
              <strong>Story:</strong> {story}
            </Text>
          )}

          {summary && (
            <Text style={paragraph}>
              <strong>AI Summary:</strong> <em>{summary}</em>
            </Text>
          )}

          <Button href={applicationUrl} style={button}>
            Review application
          </Button>
          <Text style={fallbackLink}>
            If the button doesn't work, copy and paste this link into your
            browser:
            <br />
            <Link href={applicationUrl} style={linkStyle}>
              {applicationUrl}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export function adminNotificationText({
  name,
  email,
  applicationUrl,
  story,
  summary,
  topics,
  howHeard,
  location,
}: {
  name: string;
  email: string;
  applicationUrl: string;
  story?: string;
  summary?: string;
  topics?: string[];
  howHeard?: string;
  location?: string;
}) {
  const parts = [`New application from ${name} (${email})`];

  if (location) {
    parts.push(`Location: ${location}`);
  }

  if (topics && topics.length > 0) {
    parts.push(`Topics: ${topics.join(", ")}`);
  }

  if (howHeard) {
    parts.push(`How heard: ${howHeard}`);
  }

  if (story) {
    parts.push(`Story: ${story}`);
  }

  if (summary) {
    parts.push(`Summary: ${summary}`);
  }

  parts.push(applicationUrl);

  return parts.join("\n\n");
}

const body = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  background: "#ffffff",
  color: "#000000",
  margin: 0,
  padding: "40px 0",
};

const container = {
  maxWidth: "480px",
  border: "1px solid #e0e0e0",
  borderRadius: "12px",
  padding: "32px",
};

const heading = {
  fontSize: "24px",
  fontWeight: 700,
  margin: "0 0 8px",
  color: "#000000",
};

const paragraph = {
  fontSize: "14px",
  color: "#555555",
  margin: "0 0 16px",
};

const button = {
  display: "inline-block",
  padding: "12px 24px",
  background: "#000000",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: 700,
  fontSize: "14px",
  borderRadius: "8px",
};

const linkStyle = {
  color: "#000000",
};

const fallbackLink = {
  fontSize: "12px",
  color: "#777777",
  margin: "16px 0 0",
};
