import { initClient } from "rwsdk/client";

// No client-side navigation — use regular full-page loads with <a href> tags.
// This avoids the browser's history.replaceState rate limit that occurs with
// scroll-position saving during SPA-style navigation.
initClient({});
