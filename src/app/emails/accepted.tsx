import { Body, Container, Head, Html, Text, Link } from "react-email";
import * as React from "react";

export default function AcceptedEmail({
  name,
  registrationCode,
  eventUrl,
}: {
  name: string;
  registrationCode: string;
  eventUrl: string;
}) {
  return (
    <Html>
      <Head />
      <Body style={body}>
        <Container style={container}>
          <Text style={heading}>Welcome to AgentCribs!</Text>
          <Text style={paragraph}>Hi {name},</Text>
          <Text style={paragraph}>
            We're thrilled to welcome you to AgentCribs! Your application has
            been <strong>accepted</strong>.
          </Text>
          <Text style={paragraph}>
            Here's the invite link to the event:
          </Text>
          <Text style={linkBlock}>
            <Link href={eventUrl} style={link}>
              {eventUrl}
            </Link>
          </Text>
          <Text style={paragraph}>
            Use this registration code:{" "}
            <strong style={code}>{registrationCode}</strong>
          </Text>
          <Text style={closing}>— AgentCribs Team</Text>
        </Container>
      </Body>
    </Html>
  );
}

export function acceptedText({
  name,
  registrationCode,
  eventUrl,
}: {
  name: string;
  registrationCode: string;
  eventUrl: string;
}) {
  return `Hi ${name},

We're thrilled to welcome you to AgentCribs! Your application has been accepted.

Here's the invite link to the event:
${eventUrl}

Use this registration code: ${registrationCode}

— AgentCribs Team`;
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

const linkBlock = {
  fontSize: "14px",
  margin: "0 0 16px",
  padding: "12px",
  background: "#f5f5f5",
  borderRadius: "8px",
  textAlign: "center" as const,
};

const link = {
  color: "#000000",
  fontWeight: 600,
};

const code = {
  fontSize: "18px",
  letterSpacing: "2px",
  fontFamily: "monospace",
  color: "#000000",
};

const closing = {
  fontSize: "14px",
  color: "#777777",
  margin: 0,
};
