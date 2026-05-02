import { Body, Container, Head, Html, Text } from "react-email";
import * as React from "react";

export default function PendingReviewEmail({
  name,
  location,
  howHeard,
  topics,
  story,
  summary,
}: {
  name: string;
  location?: string;
  howHeard?: string;
  topics?: string[];
  story?: string;
  summary?: string;
}) {
  return (
    <Html>
      <Head />
      <Body style={body}>
        <Container style={container}>
          <Text style={heading}>Application Under Review</Text>
          <Text style={paragraph}>Hi {name},</Text>
          <Text style={paragraph}>
            Thank you for applying to AgentCribs! Your application has been
            verified and is now pending review. Here's a summary of what
            you shared with us:
          </Text>

          {location && (
            <Text style={paragraph}>
              <strong>Location:</strong> {location}
            </Text>
          )}

          {howHeard && (
            <Text style={paragraph}>
              <strong>How Heard:</strong> {howHeard}
            </Text>
          )}

          {topics && topics.length > 0 && (
            <Text style={paragraph}>
              <strong>Topics:</strong> {topics.join(", ")}
            </Text>
          )}

          {story && (
            <Text style={paragraph}>
              <strong>Your story:</strong> {story}
            </Text>
          )}

          {summary && (
            <Text style={paragraph}>
              <strong>AI Summary:</strong> <em>{summary}</em>
            </Text>
          )}

          <Text style={paragraph}>
            We'll get back to you soon.
          </Text>
          <Text style={closing}>— AgentCribs Team</Text>
        </Container>
      </Body>
    </Html>
  );
}

export function pendingReviewText({
  name,
  location,
  howHeard,
  topics,
  story,
  summary,
}: {
  name: string;
  location?: string;
  howHeard?: string;
  topics?: string[];
  story?: string;
  summary?: string;
}) {
  const parts = [
    `Hi ${name},`,
    `Thank you for applying to AgentCribs! Your application has been verified and is now pending review. Here's a summary of what you shared:`,
  ];

  if (location) {
    parts.push(`Location: ${location}`);
  }

  if (howHeard) {
    parts.push(`How Heard: ${howHeard}`);
  }

  if (topics && topics.length > 0) {
    parts.push(`Topics: ${topics.join(", ")}`);
  }

  if (story) {
    parts.push(`Your story: ${story}`);
  }

  if (summary) {
    parts.push(`AI Summary: ${summary}`);
  }

  parts.push(`We'll get back to you soon.`);
  parts.push(`— AgentCribs Team`);

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

const closing = {
  fontSize: "14px",
  color: "#777777",
  margin: 0,
};
