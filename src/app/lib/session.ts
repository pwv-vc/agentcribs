import type { defineDurableSession } from "rwsdk/auth";

// Initialized by worker.tsx at startup — lazy-created DO binding needs
// to be registered from the worker entry point for RPC to resolve the class.
let _store: ReturnType<typeof defineDurableSession> | null = null;

export function initSessionStore(store: NonNullable<typeof _store>) {
  _store = store;
}

export function getSessionStore(): NonNullable<typeof _store> {
  if (!_store) throw new Error("sessionStore not initialized — call initSessionStore first");
  return _store;
}
