"use client";

import { useEffect, useRef, type ReactNode } from "react";

/* ---- icons ---- */
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="currentColor">
    <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.74 1.27 3.41.97.1-.76.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.42.37.79 1.09.79 2.2v3.26c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" {...stroke}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-12h4v1.5A6 6 0 0 1 16 8Z" />
    <rect x="2" y="9" width="4" height="12" rx="0.5" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" {...stroke}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <path d="m3 6.5 9 6 9-6" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" {...stroke}>
    <path d="M6.5 3.5h3l1.4 4-2 1.4a12 12 0 0 0 5.2 5.2l1.4-2 4 1.4v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z" />
  </svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" {...stroke}>
    <path d="M12 21s7-5.6 7-11a7 7 0 0 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);
const BlogIcon = () => (
  <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" {...stroke}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
    <path d="M7.5 9h6M7.5 13h9M7.5 17h9" />
  </svg>
);

type Item = { label: string; href: string; icon: ReactNode; external?: boolean };

const ITEMS: Item[] = [
  { label: "GitHub", href: "https://github.com/taufeeqahmedmd", icon: <GithubIcon />, external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/mohammedtaufeeqahmed", icon: <LinkedInIcon />, external: true },
  { label: "Blog", href: "/blog", icon: <BlogIcon /> },
  { label: "Email", href: "mailto:mdtaufeeqahmed15@gmail.com", icon: <MailIcon /> },
  { label: "Call", href: "tel:+919347052423", icon: <PhoneIcon /> },
  { label: "Hyderabad, India", href: "https://www.google.com/maps/search/Hyderabad,+India", icon: <PinIcon />, external: true },
];

const BASE = 46; // resting icon size (px)
const MAX = 82; // magnified size (px)
const RANGE = 150; // cursor influence radius (px)
const SPRING = 0.22; // 0..1 — higher = snappier

function targetSize(dist: number) {
  const d = Math.abs(dist);
  if (d >= RANGE) return BASE;
  const t = 1 - d / RANGE;
  const eased = t * t * (3 - 2 * t); // smoothstep
  return BASE + (MAX - BASE) * eased;
}

export default function Dock() {
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef<number>(Infinity); // Infinity = not hovering
  const sizes = useRef<number[]>(ITEMS.map(() => BASE));

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let rafId: number | null = null;
    let running = false;

    const frame = () => {
      const n = ITEMS.length;
      const hovering = mouseX.current !== Infinity;

      // 1) read all live centers first (batch reads → avoid layout thrash)
      const centers: number[] = new Array(n);
      for (let i = 0; i < n; i++) {
        const el = refs.current[i];
        if (!el) {
          centers[i] = 0;
          continue;
        }
        const r = el.getBoundingClientRect();
        centers[i] = r.left + r.width / 2;
      }

      // 2) spring each size toward its target and write
      let busy = false;
      for (let i = 0; i < n; i++) {
        const el = refs.current[i];
        if (!el) continue;
        const target = hovering ? targetSize(mouseX.current - centers[i]) : BASE;
        const next = sizes.current[i] + (target - sizes.current[i]) * SPRING;
        sizes.current[i] = next;
        el.style.width = `${next}px`;
        el.style.height = `${next}px`;
        if (Math.abs(target - next) > 0.15) busy = true;
      }

      if (hovering || busy) {
        rafId = requestAnimationFrame(frame);
      } else {
        // settle exactly and stop
        for (let i = 0; i < n; i++) {
          sizes.current[i] = BASE;
          const el = refs.current[i];
          if (el) {
            el.style.width = `${BASE}px`;
            el.style.height = `${BASE}px`;
          }
        }
        running = false;
      }
    };

    const start = () => {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(frame);
      }
    };
    const onMove = (e: PointerEvent) => {
      mouseX.current = e.clientX;
      start();
    };
    const onLeave = () => {
      mouseX.current = Infinity;
      start();
    };

    bar.addEventListener("pointermove", onMove);
    bar.addEventListener("pointerleave", onLeave);
    return () => {
      bar.removeEventListener("pointermove", onMove);
      bar.removeEventListener("pointerleave", onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex justify-center px-3 max-[860px]:bottom-[calc(0.6rem+env(safe-area-inset-bottom))]">
      <div
        ref={barRef}
        className="pointer-events-auto flex h-[68px] max-w-full items-end gap-2.5 rounded-[22px] border border-white/12 bg-[rgba(18,19,21,0.62)] px-3 pb-2.5 shadow-[0_18px_50px_rgba(0,0,0,0.55)] backdrop-blur-[18px] max-[860px]:h-[62px] max-[860px]:gap-2 max-[860px]:px-2.5 max-[860px]:pb-2 max-[360px]:gap-1.5 max-[360px]:px-1.5"
      >
        {ITEMS.map((it, i) => (
          <a
            key={it.label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            href={it.href}
            target={it.external ? "_blank" : undefined}
            rel={it.external ? "noopener" : undefined}
            aria-label={it.label}
            className="group relative flex flex-shrink-0 items-end justify-center no-underline"
            style={{ width: BASE, height: BASE }}
          >
            {/* tooltip */}
            <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#0e0f11]/95 px-2.5 py-1 text-[11px] font-medium text-ink opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
              {it.label}
              <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-white/10 bg-[#0e0f11]" />
            </span>

            {/* tile */}
            <span className="flex h-full w-full items-center justify-center rounded-[27%] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.1),rgba(255,255,255,0.02))] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_4px_10px_rgba(0,0,0,0.35)] transition-colors duration-200 group-hover:border-accent/50 group-hover:text-accent">
              {it.icon}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
