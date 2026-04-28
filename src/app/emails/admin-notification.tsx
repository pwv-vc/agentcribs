import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Link,
  Text,
} from "@react-email/components";
import * as React from "react";

export default function AdminNotificationEmail({
  name,
  email,
}: {
  name: string;
  email: string;
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
          </Text>
          <Text style={paragraph}>
            Their application is ready for review.
          </Text>
          <Button href="https://agentcribs.com/admin/applications" style={button}>
            Review applications
          </Button>
        </Container>
      </Body>
    </Html>
  );
}

export function adminNotificationText({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  return `New application from ${name} (${email}) is ready for review.

Go to https://agentcribs.com/admin/applications`;
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
