/**
 * Returns a Gravatar avatar URL for the given email.
 * Falls back to a default identicon if no Gravatar exists.
 */
export async function gravatarUrl(
  email: string,
  size = 80,
): Promise<string> {
  const normalized = email.trim().toLowerCase();
  const hash = await crypto.subtle.digest(
    "MD5",
    new TextEncoder().encode(normalized),
  );
  const hex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `https://www.gravatar.com/avatar/${hex}?d=identicon&s=${size}`;
}
