import { env } from "cloudflare:workers";
import { db } from "@/db/db";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";

const EMAIL_INDEX_PREFIX = "email:";

/**
 * Seed a test application in KV so the auto-backfill flow can find it.
 */
export async function seedApplication(email: string, applicationId: string) {
  await env.AGENTCRIBS_KV.put(
    `${EMAIL_INDEX_PREFIX}${email.toLowerCase().trim()}`,
    applicationId,
  );

  await env.AGENTCRIBS_KV.put(
    `app:${applicationId}`,
    JSON.stringify({
      id: applicationId,
      email: email.toLowerCase().trim(),
      firstName: "Test",
      lastName: "User",
      status: "accepted",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  );
}

/**
 * Remove test data from KV.
 */
export async function cleanupApplication(email: string, applicationId: string) {
  await env.AGENTCRIBS_KV.delete(`${EMAIL_INDEX_PREFIX}${email.toLowerCase().trim()}`);
  await env.AGENTCRIBS_KV.delete(`app:${applicationId}`);
}

/**
 * Check if an account exists in D1 for the given email.
 */
export async function accountExists(email: string) {
  const [account] = await db
    .select({ id: accounts.id, email: accounts.email })
    .from(accounts)
    .where(eq(accounts.email, email.toLowerCase().trim()))
    .limit(1);
  return account ?? null;
}

/**
 * Delete an account from D1 for cleanup.
 */
export async function deleteAccount(email: string) {
  await db.delete(accounts).where(eq(accounts.email, email.toLowerCase().trim()));
}

/**
 * Test wrapper: calls initiateAccountLogin with FormData and returns
 * a plain object (status + headers) suitable for vitestInvoke serialization.
 */
export async function testInitiateLogin(email: string) {
  // Dynamically import to avoid circular deps at module level
  const { initiateAccountLogin } = await import("@/app/actions/account");

  const formData = new FormData();
  if (email) {
    formData.set("email", email);
  }

  const response = await initiateAccountLogin(formData);

  // Convert Response to plain object for JSON serialization across the bridge
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return {
    status: response.status,
    headers,
  };
}
