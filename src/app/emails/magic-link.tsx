import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Text,
} from "react-email";
import * as React from "react";

export default function MagicLinkEmail({ verifyUrl }: { verifyUrl: string }) {
  return (
    <Html>
      <Head />
      <Preview>Final step for your AgentCribs application</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={heading}>Final step for your AgentCribs application</Text>
          <Text style={paragraph}>
            There is one more step. Verify your email address to complete your
            AgentCribs application and make it visible to our review team.
          </Text>
          <Button href={verifyUrl} style={button}>
            Verify email and complete application
          </Button>
          <Text style={footnote}>
            This link expires in 1 hour. If you need support, reply to this
            email or email{" "}
            <Link href="mailto:support@agentcribs.com" style={linkStyle}>
              support@agentcribs.com
            </Link>
            . If you didn't apply to AgentCribs, you can safely ignore this
            email.
          </Text>
          <Text style={footnote}>
            Or paste this link into your browser:
            <br />
            <Link href={verifyUrl} style={linkStyle}>
              {verifyUrl}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export function magicLinkText({ verifyUrl }: { verifyUrl: string }) {
  return `Final step for your AgentCribs application

There is one more step. Verify your email address to complete your AgentCribs application and make it visible to our review team.

Click this link to verify and complete your application: ${verifyUrl}

This link expires in 1 hour. If you need support, reply to this email or email support@agentcribs.com.

If you didn't apply to AgentCribs, you can safely ignore this email.`;
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
  margin: "0 0 24px",
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

const footnote = {
  fontSize: "12px",
  color: "#777777",
  margin: "24px 0 0",
};

const linkStyle = {
  color: "#000000",
};
