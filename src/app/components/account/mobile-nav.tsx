"use client";

import { useState } from "react";
import { link } from "@/app/shared/links";

interface AccountMobileNavProps {
  email?: string;
  avatarUrl?: string | null;
  isDev: boolean;
}

export function AccountMobileNav({ email, avatarUrl, isDev }: AccountMobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-md border border-border bg-bg p-2 text-text-secondary hover:bg-bg-muted"
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-5"
        >
          {open ? (
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          ) : (
            <path d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full border-b border-border bg-bg-soft px-4 py-3 z-50">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex flex-col gap-2">
              {email && (
                <span className="flex items-center gap-1.5 text-xs text-text-secondary pb-2 border-b border-border">
                  {avatarUrl && (
                    <img
                      src={avatarUrl}
                      alt=""
                      className="size-4 rounded-full"
                    />
                  )}
                  {email}
                </span>
              )}
              <a
                href={link("/profile")}
                className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary no-underline hover:bg-bg-muted hover:text-text"
              >
                Profile
              </a>
              <a
                href="/"
                className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary no-underline hover:bg-bg-muted hover:text-text"
              >
                Back to site
              </a>
              {!isDev && (
                <a
                  href="/cdn-cgi/access/logout"
                  className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary no-underline hover:bg-bg-muted hover:text-text"
                >
                  Logout
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
