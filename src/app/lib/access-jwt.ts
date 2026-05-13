import { createRemoteJWKSet, jwtVerify } from "jose";

export interface AccessIdentity {
  email: string;
  sub: string;
}

/**
 * Verifies the CF Access JWT from `Cf-Access-Jwt-Assertion` header and
 * returns the authenticated user's email and subject ID.
 * Returns null if no token is present or verification fails.
 */
export async function verifyAccessToken(
  request: Request,
  teamDomain: string,
  audience: string,
): Promise<AccessIdentity | null> {
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) return null;

  try {
    const JWKS = createRemoteJWKSet(
      new URL(`${teamDomain}/cdn-cgi/access/certs`),
    );
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: teamDomain,
      audience,
    });

    const email =
      typeof payload.email === "string" ? payload.email : null;
    const sub =
      typeof payload.sub === "string" ? payload.sub : null;

    if (!email || !sub) return null;

    return { email, sub };
  } catch {
    return null;
  }
}
