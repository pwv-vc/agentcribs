"use client";

import { useEffect, useRef, useState } from "react";

const BRANCH_SIGNALS = [
  { href: "#semver-merge-a", color: "teal", begin: "-6s" },
  { href: "#semver-merge-c", color: "teal", begin: "-14s" },
  { href: "#semver-merge-b", color: "lavender", begin: "-10s" },
  { href: "#semver-merge-d", color: "lavender", begin: "-2s" },
  { href: "#semver-merge-e", color: "periwinkle", begin: "-18s" },
  { href: "#semver-merge-f", color: "periwinkle", begin: "-21s" },
  { href: "#semver-merge-g", color: "periwinkle", begin: "-13s" },
  { href: "#semver-merge-h", color: "periwinkle", begin: "-5s" },
];

export function SemverFlourish() {
  const ref = useRef<HTMLDivElement>(null);
  const [signalsOn, setSignalsOn] = useState(false);

  // Light up the moving signals only once the flourish scrolls into view,
  // so nothing drifts while the rail is still drawing itself in.
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setSignalsOn(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSignalsOn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="semver-flourish"
      aria-label="Collaborative semantic version rail from 0.0.1 to 1.0.0"
    >
      <svg
        viewBox="0 0 980 260"
        role="img"
        aria-labelledby="semver-flourish-title"
        className="h-auto w-full"
      >
        <title id="semver-flourish-title">
          Collaborative semantic version rail moving from 0.0.1 to 1.0.0
        </title>
        <defs>
          <path
            id="semver-main-rail"
            d="M76 198 H210 C244 198 258 176 282 152 L364 112 C392 98 420 92 456 92 H610 C650 92 670 62 692 52 C732 38 760 24 812 24 C850 24 876 16 908 16"
          />
          <path id="semver-merge-a" d="M82 132 H168 C218 132 242 152 282 152" />
          <path id="semver-merge-b" d="M126 232 H188 C232 232 250 184 282 152" />
          <path id="semver-merge-c" d="M300 66 H358 C392 66 414 92 456 92" />
          <path id="semver-merge-d" d="M500 160 H584 C636 160 646 72 692 52" />
          <path id="semver-merge-e" d="M64 92 H122 C150 92 158 114 178 132" />
          <path id="semver-merge-f" d="M222 246 H264 C300 246 314 170 348 120" />
          <path id="semver-merge-g" d="M394 210 H462 C504 210 520 170 552 160" />
          <path id="semver-merge-h" d="M628 228 H700 C760 228 764 64 812 24" />
          <linearGradient
            id="semver-main-gradient"
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" className="semver-gradient-start" />
            <stop offset="55%" className="semver-gradient-mid" />
            <stop offset="100%" className="semver-gradient-end" />
          </linearGradient>
        </defs>

        <g className="semver-guide reveal-fade">
          <path d="M70 198 H920" />
          <path d="M274 152 H742" />
          <path d="M448 92 H742" />
          <path d="M610 24 H812" />
          <path d="M682 52 C732 38 760 24 812 24 C850 24 876 16 920 16" />
        </g>

        <g className="semver-merge">
          <path className="draw semver-merge-teal" d="M82 132 H168 C218 132 242 152 282 152" />
          <path className="draw semver-merge-teal" d="M300 66 H358 C392 66 414 92 456 92" />
        </g>
        <g className="semver-merge">
          <path className="draw semver-merge-lavender" d="M126 232 H188 C232 232 250 184 282 152" />
          <path className="draw semver-merge-lavender" d="M500 160 H584 C636 160 646 72 692 52" />
        </g>
        <g className="semver-merge">
          <path className="draw semver-merge-periwinkle" d="M64 92 H122 C150 92 158 114 178 132" />
          <path className="draw semver-merge-periwinkle" d="M222 246 H264 C300 246 314 170 348 120" />
          <path className="draw semver-merge-periwinkle" d="M394 210 H462 C504 210 520 170 552 160" />
          <path className="draw semver-merge-periwinkle" d="M628 228 H700 C760 228 764 64 812 24" />
        </g>

        <path
          className="draw semver-main-rail"
          pathLength={1}
          d="M76 198 H210 C244 198 258 176 282 152 L364 112 C392 98 420 92 456 92 H610 C650 92 670 62 692 52 C732 38 760 24 812 24 C850 24 876 16 908 16"
        />

        <g className="reveal-fade semver-nodes">
          <rect className="semver-milestone" x="70" y="192" width="12" height="12" rx="2" />
          <rect className="semver-milestone" x="450" y="86" width="12" height="12" rx="2" />
          <rect className="semver-milestone" x="902" y="10" width="12" height="12" rx="2" />
          <circle className="node-teal" cx="282" cy="152" r="5" />
          <circle className="node-periwinkle" cx="178" cy="132" r="4" />
          <circle className="node-periwinkle" cx="348" cy="120" r="4" />
          <circle className="node-teal" cx="456" cy="92" r="5" />
          <circle className="node-lavender" cx="552" cy="160" r="4" />
          <circle className="node-lavender" cx="692" cy="52" r="5" />
          <circle className="node-periwinkle" cx="812" cy="24" r="4" />
        </g>

        <g className="reveal-fade semver-labels">
          <text x="52" y="224">0.0.1</text>
          <text x="422" y="78">0.1.0</text>
          <text x="842" y="52">1.0.0</text>
        </g>

        <g className={`signal-group ${signalsOn ? "signal-on" : ""}`}>
          <circle className="semver-signal semver-main-comet" r="4">
            <animateMotion dur="26s" repeatCount="indefinite" begin="-8s">
              <mpath href="#semver-main-rail" />
            </animateMotion>
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.05;0.88;1"
              dur="26s"
              repeatCount="indefinite"
              begin="-8s"
            />
          </circle>

          {BRANCH_SIGNALS.map(({ href, color, begin }) => (
            <circle
              key={href}
              className={`semver-signal semver-branch-particle-${color}`}
              r={color === "periwinkle" ? 2.5 : 3.25}
            >
              <animateMotion dur="26s" repeatCount="indefinite" begin={begin}>
                <mpath href={href} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.08;0.82;1"
                dur="26s"
                repeatCount="indefinite"
                begin={begin}
              />
            </circle>
          ))}

          <circle className="semver-ping" cx="908" cy="16" r="6" />
        </g>
      </svg>
    </div>
  );
}
