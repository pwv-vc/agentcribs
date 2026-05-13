"use client";

import { useState } from "react";
import { link } from "@/app/shared/links";

interface MobileNavProps {
  displayEmailAddress?: string;
  isDev: boolean;
}

export function MobileNav({ displayEmailAddress, isDev }: MobileNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="rounded-md border border-border bg-bg p-2 text-text-secondary hover:bg-bg-muted"
        aria-label="Toggle menu"
        aria-expanded={mobileMenuOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-5"
        >
          {mobileMenuOpen ? (
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          ) : (
            <path d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z" />
          )}
        </svg>
      </button>

      {/* Mobile nav menu - rendered outside the header flex container */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full border-b border-border bg-bg-soft px-4 py-3 z-50">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex flex-col gap-2">
              {displayEmailAddress && (
                <span className="flex items-center gap-1.5 text-xs text-text-secondary pb-2 border-b border-border">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-4"
                  >
                    <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                  </svg>
                  {displayEmailAddress}
                </span>
              )}
              <a
                href={link("/admin/applications")}
                className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary no-underline transition-colors hover:bg-bg-muted hover:text-text"
              >
                Applications
              </a>
              <a
                href={link("/admin/events")}
                className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary no-underline transition-colors hover:bg-bg-muted hover:text-text"
              >
                Events
              </a>
              <a
                href={link("/admin/accounts")}
                className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary no-underline transition-colors hover:bg-bg-muted hover:text-text"
              >
                Accounts
              </a>
              <a
                href="/"
                className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary no-underline transition-colors hover:bg-bg-muted hover:text-text"
              >
                Back to site
              </a>
              {!isDev && (
                <a
                  href="/cdn-cgi/access/logout"
                  className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary no-underline transition-colors hover:bg-bg-muted hover:text-text"
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
