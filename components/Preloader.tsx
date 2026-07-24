"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Deploy-sequence preloader. Types a terminal command, then runs a fake
 * "deploy" through four stages (BUILD → TEST → DEPLOY → RELEASE) while a
 * progress rail fills, then fades out to reveal the site.
 *
 * Plays on every page load. The real page renders underneath (SSR); this
 * opaque overlay covers it until the sequence completes, then fades away.
 */

const PROMPT_USER = "taufeeq@cloud";
const COMMAND = "deploy --env production --portfolio";

const STAGES = [
  { key: "BUILD", label: "BUILD", msg: "compiling & building container images…" },
  { key: "TEST", label: "TEST", msg: "running test suites & health checks…" },
  { key: "DEPLOY", label: "DEPLOY", msg: "rolling out to production edge nodes…" },
  { key: "RELEASE", label: "RELEASE", msg: "deployment complete · portfolio is live" },
] as const;

// time(ms) → percent, giving the bar an organic, staged cadence
const KEYFRAMES: [number, number][] = [
  [0, 0],
  [340, 16],
  [720, 33],
  [1040, 50],
  [1380, 67],
  [1760, 86],
  [2050, 100],
];

function pctAt(t: number): number {
  if (t <= 0) return 0;
  for (let i = 1; i < KEYFRAMES.length; i++) {
    const [t1, p1] = KEYFRAMES[i];
    if (t <= t1) {
      const [t0, p0] = KEYFRAMES[i - 1];
      return p0 + ((p1 - p0) * (t - t0)) / (t1 - t0);
    }
  }
  return 100;
}

function stageOf(pct: number): number {
  if (pct >= 100) return 3;
  if (pct >= 66.6) return 2;
  if (pct >= 33.3) return 1;
  return 0;
}

/* ── Stage icons (18px, stroke) ─────────────────────────────── */
function Icon({ name }: { name: (typeof STAGES)[number]["key"] }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "BUILD": // wrench
      return (
        <svg {...common}>
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1a1.4 1.4 0 0 1-2-2z" />
        </svg>
      );
    case "TEST": // flask
      return (
        <svg {...common}>
          <path d="M10 2v7.5a2 2 0 0 1-.2.9L4.7 20.6a1 1 0 0 0 .9 1.4h12.8a1 1 0 0 0 .9-1.4l-5.1-10.2a2 2 0 0 1-.2-.9V2" />
          <path d="M8.5 2h7" />
          <path d="M7 16h10" />
        </svg>
      );
    case "DEPLOY": // rocket
      return (
        <svg {...common}>
          <path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1z" />
          <path d="M12 15l-3-3a22 22 0 0 1 2-4A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2z" />
          <path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0" />
          <path d="M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5" />
        </svg>
      );
    case "RELEASE": // package
      return (
        <svg {...common}>
          <path d="m7.5 4.3 9 5.1" />
          <path d="M21 8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      );
  }
}

export default function Preloader() {
  const [mounted, setMounted] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [typed, setTyped] = useState("");
  const [pct, setPct] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    document.body.style.overflow = "hidden";
    const timers: number[] = [];

    const finish = () => {
      setLeaving(true);
      timers.push(
        window.setTimeout(() => {
          document.body.style.overflow = "";
          setMounted(false);
        }, 600)
      );
    };

    const runBar = () => {
      if (reduce) {
        setPct(100);
        timers.push(window.setTimeout(finish, 500));
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const p = pctAt(now - start);
        setPct(p);
        if (p >= 100) {
          timers.push(window.setTimeout(finish, 480));
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    // Type the command, then run the bar
    if (reduce) {
      setTyped(COMMAND);
      timers.push(window.setTimeout(runBar, 200));
    } else {
      let i = 0;
      const type = () => {
        i += 1;
        setTyped(COMMAND.slice(0, i));
        if (i < COMMAND.length) {
          timers.push(window.setTimeout(type, 26));
        } else {
          timers.push(window.setTimeout(runBar, 260));
        }
      };
      timers.push(window.setTimeout(type, 260));
    }

    return () => {
      document.body.style.overflow = "";
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      timers.forEach(clearTimeout);
    };
  }, []);

  if (!mounted) return null;

  const shown = Math.floor(pct);
  const stage = stageOf(pct);
  const message = STAGES[stage].msg;

  return (
    <div
      className={`preloader fixed inset-0 z-[200] grid place-items-center px-6 ${
        leaving ? "is-leaving" : ""
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <div className="w-full max-w-[600px] font-mono">
        {/* Terminal prompt */}
        <p className="text-[13px] sm:text-[14.5px] leading-none tracking-tight">
          <span className="text-accent">{PROMPT_USER}</span>
          <span className="text-faint"> :~$ </span>
          <span className="text-ink">{typed}</span>
          <span className="preloader-caret ml-[3px] inline-block h-[1.05em] w-[7px] translate-y-[2px] bg-accent align-middle" />
        </p>

        {/* Stage rail */}
        <div className="relative mt-11">
          {/* base track */}
          <div className="absolute left-5 right-5 top-5 h-px -translate-y-1/2 bg-white/10" />
          {/* accent fill */}
          <div
            className="absolute left-5 top-5 h-px -translate-y-1/2 bg-accent transition-[width] duration-100 ease-linear"
            style={{
              width: `calc((100% - 40px) * ${pct / 100})`,
              boxShadow: "0 0 8px rgba(148,242,60,0.55)",
            }}
          />
          {/* nodes */}
          <div className="relative flex justify-between">
            {STAGES.map((s, i) => {
              const done = i < stage || pct >= 100;
              const active = i === stage && pct < 100;
              return (
                <div
                  key={s.key}
                  className="flex w-10 flex-col items-center gap-2.5"
                >
                  <span
                    className={[
                      "grid h-10 w-10 place-items-center rounded-full border transition-colors duration-300",
                      done
                        ? "border-accent bg-accent text-[#12200a]"
                        : active
                        ? "preloader-node-active border-accent bg-accent/10 text-accent"
                        : "border-white/15 bg-white/[0.03] text-faint",
                    ].join(" ")}
                  >
                    <Icon name={s.key} />
                  </span>
                  <span
                    className={[
                      "whitespace-nowrap text-[9.5px] font-semibold uppercase tracking-[0.22em] transition-colors duration-300",
                      done || active ? "text-muted" : "text-faint/70",
                    ].join(" ")}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status + percent */}
        <div className="mt-9 flex items-end justify-between gap-4">
          <p className="min-w-0 truncate text-[12.5px] text-muted">
            <span className="mr-2 text-accent">›</span>
            {message}
          </p>
          <p className="flex shrink-0 items-baseline text-ink tabular-nums">
            <span className="text-[22px] font-semibold leading-none">
              {shown}
            </span>
            <span className="ml-0.5 text-[12px] text-faint">%</span>
          </p>
        </div>
      </div>
    </div>
  );
}
