"use client";

import { useState, useRef, useEffect } from "react";
import {
  ListIcon,
  CheckCircleIcon,
  ClockIcon,
  QuestionIcon,
  XCircleIcon,
} from "@/app/components/icons";

const DOWNLOAD_OPTIONS = [
  { value: "all", label: "All Applications", Icon: ListIcon },
  { value: "accepted", label: "Accepted", Icon: CheckCircleIcon },
  { value: "pending", label: "Pending", Icon: ClockIcon },
  { value: "unverified", label: "Unverified", Icon: QuestionIcon },
  { value: "rejected", label: "Rejected", Icon: XCircleIcon },
] as const;

export function DownloadDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-bg-muted"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-4"
        >
          <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.03 8.235a.75.75 0 1 0-1.06 1.06l4.5 4.5a.75.75 0 0 0 1.06 0l4.5-4.5a.75.75 0 0 0-1.06-1.06l-3.22 3.129V2.75Z" />
          <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
        </svg>
        Download
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-border bg-bg shadow-lg">
          {DOWNLOAD_OPTIONS.map(({ value, label, Icon }) => (
            <a
              key={value}
              href={`/admin/applications/download?status=${value}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-text no-underline transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-bg-muted"
            >
              <Icon />
              {label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
