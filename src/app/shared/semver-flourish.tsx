export function SemverFlourish() {
  return (
    <div className="semver-flourish" aria-label="Collaborative semantic version rail from 0.0.1 to 1.0.0">
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
          <path
            id="semver-merge-a"
            d="M82 132 H168 C218 132 242 152 282 152"
          />
          <path
            id="semver-merge-b"
            d="M126 232 H188 C232 232 250 184 282 152"
          />
          <path
            id="semver-merge-c"
            d="M300 66 H358 C392 66 414 92 456 92"
          />
          <path
            id="semver-merge-d"
            d="M500 160 H584 C636 160 646 72 692 52"
          />
          <path
            id="semver-merge-e"
            d="M64 92 H122 C150 92 158 114 178 132"
          />
          <path
            id="semver-merge-f"
            d="M222 246 H264 C300 246 314 170 348 120"
          />
          <path
            id="semver-merge-g"
            d="M394 210 H462 C504 210 520 170 552 160"
          />
          <path
            id="semver-merge-h"
            d="M628 228 H700 C760 228 764 64 812 24"
          />
        </defs>

        <g className="semver-guide">
          <path d="M70 198 H920" />
          <path d="M274 152 H742" />
          <path d="M448 92 H742" />
          <path d="M610 24 H812" />
          <path d="M682 52 C732 38 760 24 812 24 C850 24 876 16 920 16" />
        </g>

        <g className="semver-merge semver-merge-cyan">
          <use href="#semver-merge-a" />
          <use href="#semver-merge-c" />
        </g>
        <g className="semver-merge semver-merge-green">
          <use href="#semver-merge-b" />
          <use href="#semver-merge-d" />
        </g>
        <g className="semver-merge semver-merge-warm">
          <use href="#semver-merge-e" />
          <use href="#semver-merge-f" />
          <use href="#semver-merge-g" />
          <use href="#semver-merge-h" />
        </g>

        <use href="#semver-main-rail" className="semver-main-rail" />

        <g className="semver-nodes">
          <rect className="semver-milestone" x="70" y="192" width="12" height="12" rx="1" />
          <rect className="semver-milestone" x="450" y="86" width="12" height="12" rx="1" />
          <rect className="semver-milestone" x="902" y="10" width="12" height="12" rx="1" />
          <circle cx="282" cy="152" r="5" />
          <circle cx="178" cy="132" r="4" />
          <circle cx="348" cy="120" r="4" />
          <circle cx="456" cy="92" r="5" />
          <circle cx="552" cy="160" r="4" />
          <circle cx="692" cy="52" r="5" />
          <circle cx="812" cy="24" r="4" />
        </g>

        <g className="semver-labels">
          <text x="52" y="224">0.0.1</text>
          <text x="422" y="78">0.1.0</text>
          <text x="842" y="52">1.0.0</text>
        </g>

        <circle className="semver-signal semver-main-signal" r="5">
          <animateMotion dur="24s" repeatCount="indefinite" rotate="auto">
            <mpath href="#semver-main-rail" />
          </animateMotion>
        </circle>
        <circle className="semver-signal semver-merge-signal" r="3.5">
          <animateMotion dur="24s" repeatCount="indefinite" rotate="auto">
            <mpath href="#semver-merge-a" />
          </animateMotion>
        </circle>
        <circle className="semver-signal semver-merge-signal semver-merge-signal-alt" r="3.5">
          <animateMotion dur="24s" repeatCount="indefinite" rotate="auto">
            <mpath href="#semver-merge-c" />
          </animateMotion>
        </circle>
        <circle className="semver-signal semver-branch-particle semver-branch-particle-warm" r="2.5">
          <animateMotion dur="32s" repeatCount="indefinite" rotate="auto">
            <mpath href="#semver-merge-b" />
          </animateMotion>
        </circle>
        <circle className="semver-signal semver-branch-particle semver-branch-particle-cyan" r="2.25">
          <animateMotion dur="36s" repeatCount="indefinite" rotate="auto">
            <mpath href="#semver-merge-f" />
          </animateMotion>
        </circle>
        <circle className="semver-signal semver-branch-particle semver-branch-particle-warm" r="2.5">
          <animateMotion dur="40s" repeatCount="indefinite" rotate="auto">
            <mpath href="#semver-merge-g" />
          </animateMotion>
        </circle>
        <circle className="semver-signal semver-branch-particle semver-branch-particle-green" r="2.75">
          <animateMotion dur="42s" repeatCount="indefinite" rotate="auto">
            <mpath href="#semver-merge-h" />
          </animateMotion>
        </circle>
      </svg>
    </div>
  );
}
