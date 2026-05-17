# security

- Prevent user enumeration in login flows: when an email is submitted that doesn't match an existing account, silently succeed without sending an email — do NOT reveal that the account doesn't exist. The post-submit message should only say to check spam and verify the user has applied (with a link to /apply), never "account not found." Confidence: 0.75
- Include `i.ytimg.com` in the `img-src` Content-Security-Policy directive when the project embeds YouTube videos. Confidence: 0.70
- Include `images.lumacdn.com` and `cdn.lu.ma` in the `img-src` Content-Security-Policy directive when displaying Luma event cover images and host avatars. Confidence: 0.70
- Auth-gate document downloads by verifying the requesting user's `accountId` from the session matches the document's `account_id` — return a clean 401 Response (no body, no text file download) if unauthenticated and 403 if accessing another user's documents. Confidence: 0.75
- Enforce ownership checks in server actions and queries (the data/action layer), not just in server components at render time — reject unauthorized access early before it reaches rendering. Confidence: 0.80
