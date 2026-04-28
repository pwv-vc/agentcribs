import { Body, Container, Head, Html, Text } from "@react-email/components";
import * as React from "react";

export default function PendingReviewEmail({ name }: { name: string }) {
  return (
    <Html>
      <Head />
      <Body style={body}>
        <Container style={container}>
          <Text style={heading}>Application Under Review</Text>
          <Text style={paragraph}>Hi {name},</Text>
          <Text style={paragraph}>
            Thank you for applying to AgentCribs! Your application has been
            verified and is now pending review. We'll get back to you soon.
          </Text>
          <Text style={closing}>— AgentCribs Team</Text>
        </Container>
      </Body>
    </Html>
  );
}

export function pendingReviewText({ name }: { name: string }) {
  return `Hi ${name},

Thank you for applying to AgentCribs! Your application has been verified and is now pending review. We'll get back to you soon.

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

const closing = {
  fontSize: "14px",
  color: "#777777",
  margin: 0,
};
