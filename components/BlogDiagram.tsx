"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Native, theme-matched diagrams for blog posts — inline SVG/CSS only, no
 * raster assets. Each diagram reveals on scroll (numbered dots pop in, the
 * spine draws down, rows slide in), mirroring the ArchitectureDiagram language.
 *
 * Add a diagram to a blog section with `diagram: "<kind>"` in lib/blogs.ts.
 */

export type BlogDiagramKind = "dns-resolution" | "dns-caching" | "dns-trace" | "dns-flow";

const pad2 = (n: number) => String(n).padStart(2, "0");

type Step = { title: string; note: string };

const RESOLUTION_STEPS: Step[] = [
  {
    title: "Your device / browser",
    note: "Asks “what is the IP for example.com?” and waits for one final answer.",
  },
  {
    title: "Recursive resolver — e.g. 8.8.8.8",
    note: "Checks its cache. On a miss, it walks the tree below on your behalf.",
  },
  {
    title: "Root nameserver",
    note: "Doesn’t hold the IP — refers the resolver to the .com TLD server.",
  },
  {
    title: "TLD nameserver — .com",
    note: "Returns the NS records naming the domain’s authoritative server.",
  },
  {
    title: "Authoritative nameserver",
    note: "The source of truth — returns the A / AAAA record with its TTL.",
  },
];

type TraceHop = {
  who: string;
  kind: "query" | "referral" | "answer";
  msg: string;
  note: string;
};

// A concrete, uncached lookup of iamtaufeeq.cloud. The IP is illustrative.
const TRACE_HOPS: TraceHop[] = [
  {
    who: "Your browser",
    kind: "query",
    msg: "iamtaufeeq.cloud  A?",
    note: "Needs an IPv4 address before it can open a connection.",
  },
  {
    who: "Recursive resolver · 1.1.1.1",
    kind: "query",
    msg: "iamtaufeeq.cloud  A?  →  root",
    note: "Cache miss — so it starts asking at the top of the tree.",
  },
  {
    who: "Root nameserver",
    kind: "referral",
    msg: "referral  →  .cloud TLD servers",
    note: "Doesn’t hold the IP; points to the .cloud registry.",
  },
  {
    who: ".cloud TLD nameserver",
    kind: "referral",
    msg: "NS  →  ns1.iamtaufeeq.cloud",
    note: "Names the authoritative server for the domain.",
  },
  {
    who: "Authoritative nameserver",
    kind: "answer",
    msg: "iamtaufeeq.cloud.  300  IN  A  203.0.113.42",
    note: "The definitive record, with a 300-second TTL.",
  },
  {
    who: "Resolver  →  your browser",
    kind: "answer",
    msg: "203.0.113.42   (cached for 300s)",
    note: "Your browser connects straight to that IP.",
  },
];

const CACHE_LAYERS: { n: string; title: string; note: string }[] = [
  { n: "01", title: "Browser cache", note: "Hit → done. No OS lookup, no network — the fastest path." },
  { n: "02", title: "OS cache · stub resolver", note: "Hit → done. The query never leaves your machine." },
  { n: "03", title: "Recursive resolver cache", note: "Hit → returns the IP, or skips root/TLD using cached NS records." },
  { n: "04", title: "Origin · Root → TLD → Authoritative", note: "Full miss → complete lookup, then cache the result at every layer." },
];

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

function Reveal({
  delay,
  inView,
  children,
  className = "",
}: {
  delay: number;
  inView: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`transition-all duration-500 ease-out ${
        inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

function ResolutionDiagram() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <figure
      ref={ref}
      role="img"
      aria-label="A DNS lookup travels from your device to a recursive resolver, then down the hierarchy — root, TLD, authoritative — and the answer returns to be cached."
      className="my-9 rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-6 max-[860px]:p-5"
    >
      <figcaption className="mb-6 flex items-center gap-2.5 text-[10.5px] font-bold uppercase tracking-[0.2em] text-faint">
        <span className="inline-block h-[13px] w-1 rounded-full bg-accent" />
        Anatomy of an uncached DNS lookup
      </figcaption>

      <ol className="relative flex flex-col gap-4">
        {RESOLUTION_STEPS.map((s, i) => {
          const last = i === RESOLUTION_STEPS.length - 1;
          const d = i * 110;
          return (
            <li key={s.title} className="relative flex gap-4">
              {/* rail: numbered dot + connecting spine */}
              <div className="relative flex flex-col items-center">
                <Reveal delay={d} inView={inView}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/[0.08] font-mono text-[11px] font-bold text-accent">
                    {pad2(i + 1)}
                  </span>
                </Reveal>
                {!last && (
                  <span
                    aria-hidden
                    className={`mt-1 w-px flex-1 origin-top bg-gradient-to-b from-accent/50 to-accent/10 transition-transform duration-500 ease-out ${
                      inView ? "scale-y-100" : "scale-y-0"
                    }`}
                    style={{ transitionDelay: `${d + 90}ms` } as CSSProperties}
                  />
                )}
              </div>

              {/* content */}
              <Reveal delay={d + 70} inView={inView} className="pb-1">
                <p className="font-display text-[14px] font-bold leading-tight text-ink">{s.title}</p>
                <p className="mt-1 text-[13px] leading-[1.6] text-muted">{s.note}</p>
              </Reveal>
            </li>
          );
        })}
      </ol>

      <Reveal delay={RESOLUTION_STEPS.length * 110} inView={inView}>
        <p className="mt-5 flex items-start gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3 text-[12.5px] leading-[1.6] text-[#b9bcc0]">
          <span aria-hidden className="mt-[1px] text-accent">↩</span>
          The answer travels back up to the resolver, which caches it for the record’s TTL and hands
          the IP to your device — the whole round trip usually finishes in milliseconds.
        </p>
      </Reveal>
    </figure>
  );
}

function CachingDiagram() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <figure
      ref={ref}
      role="img"
      aria-label="DNS caching is layered closest-first: browser, then OS, then the recursive resolver, and finally the origin servers. The earliest layer holding the record answers."
      className="my-9 rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-6 max-[860px]:p-5"
    >
      <figcaption className="mb-6 flex items-center justify-between gap-3 text-[10.5px] font-bold uppercase tracking-[0.2em] text-faint">
        <span className="flex items-center gap-2.5">
          <span className="inline-block h-[13px] w-1 rounded-full bg-accent" />
          DNS caching layers
        </span>
        <span className="hidden text-[9.5px] tracking-[0.16em] text-faint/70 sm:inline">fastest → slowest</span>
      </figcaption>

      <div className="flex gap-4">
        {/* speed rail */}
        <div
          aria-hidden
          className={`w-1 shrink-0 origin-top rounded-full bg-gradient-to-b from-accent via-accent/40 to-accent/5 transition-transform duration-700 ease-out ${
            inView ? "scale-y-100" : "scale-y-0"
          }`}
        />
        <div className="flex flex-1 flex-col gap-3">
          {CACHE_LAYERS.map((l, i) => (
            <Reveal key={l.n} delay={i * 110} inView={inView}>
              <div className="rounded-[14px] border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[11px] font-bold text-accent">{l.n}</span>
                  <p className="font-display text-[13.5px] font-bold text-ink">{l.title}</p>
                </div>
                <p className="mt-1 text-[12.5px] leading-[1.55] text-muted">{l.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </figure>
  );
}

function TraceDiagram() {
  const { ref, inView } = useInView<HTMLDivElement>();

  const badge: Record<TraceHop["kind"], { label: string; cls: string }> = {
    query: { label: "query", cls: "border-white/15 bg-white/[0.05] text-muted" },
    referral: { label: "referral", cls: "border-white/15 bg-white/[0.05] text-muted" },
    answer: { label: "answer", cls: "border-accent/40 bg-accent/[0.1] text-accent" },
  };

  return (
    <figure
      ref={ref}
      role="img"
      aria-label="A concrete DNS trace resolving iamtaufeeq.cloud: the browser asks the resolver, which queries a root server, the .cloud TLD server, and the authoritative nameserver, which returns the A record 203.0.113.42."
      className="my-9 rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-6 max-[860px]:p-5"
    >
      <figcaption className="mb-6 flex items-center gap-2.5 text-[10.5px] font-bold uppercase tracking-[0.2em] text-faint">
        <span className="inline-block h-[13px] w-1 rounded-full bg-accent" />
        A real trace · resolving iamtaufeeq.cloud
      </figcaption>

      <ol className="relative flex flex-col gap-3">
        {TRACE_HOPS.map((h, i) => {
          const last = i === TRACE_HOPS.length - 1;
          const d = i * 100;
          const b = badge[h.kind];
          return (
            <li key={h.who} className="relative flex gap-3.5">
              {/* rail */}
              <div className="relative flex flex-col items-center pt-1">
                <Reveal delay={d} inView={inView}>
                  <span
                    className={`block h-2.5 w-2.5 rounded-full ${
                      h.kind === "answer" ? "bg-accent" : "bg-white/25"
                    }`}
                  />
                </Reveal>
                {!last && (
                  <span
                    aria-hidden
                    className={`mt-1 w-px flex-1 origin-top bg-gradient-to-b from-white/20 to-white/5 transition-transform duration-500 ease-out ${
                      inView ? "scale-y-100" : "scale-y-0"
                    }`}
                    style={{ transitionDelay: `${d + 80}ms` } as CSSProperties}
                  />
                )}
              </div>

              {/* exchange */}
              <Reveal delay={d + 60} inView={inView} className="flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-[13px] font-bold text-ink">{h.who}</span>
                  <span
                    className={`rounded-full border px-2 py-[1px] text-[9.5px] font-bold uppercase tracking-[0.12em] ${b.cls}`}
                  >
                    {b.label}
                  </span>
                </div>
                <code
                  className={`mt-1.5 block overflow-x-auto rounded-lg border px-3 py-2 font-mono text-[12px] leading-relaxed ${
                    h.kind === "answer"
                      ? "border-accent/25 bg-accent/[0.06] text-[#d7f7b4]"
                      : "border-white/[0.07] bg-white/[0.03] text-[#c4c7cb]"
                  }`}
                >
                  {h.msg}
                </code>
                <p className="mt-1 text-[12px] leading-[1.55] text-faint">{h.note}</p>
              </Reveal>
            </li>
          );
        })}
      </ol>

      <Reveal delay={TRACE_HOPS.length * 100} inView={inView}>
        <p className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-[11.5px] leading-[1.55] text-faint">
          The IP <span className="font-mono text-muted">203.0.113.42</span> is an illustrative
          example. Every later visitor whose resolver already has this cached skips the whole walk
          and gets the address instantly.
        </p>
      </Reveal>
    </figure>
  );
}

// ── Detailed resolution flowchart (themed to the site) ──────────────────────
const FLOW_ACCENT = "#94f23c";
const FLOW_INK = "#f4f5f6";
const FLOW_LINE = "rgba(255,255,255,0.34)";

type IconKind = "browser" | "database" | "question" | "network" | "server" | "document" | "clock" | "return";

function flowIcon(kind: IconKind, cx: number, cy: number) {
  const common = {
    fill: "none" as const,
    stroke: FLOW_ACCENT,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const dot = { fill: FLOW_ACCENT, stroke: "none" as const };
  const inner = () => {
    switch (kind) {
      case "browser":
        return (
          <>
            <rect x="2" y="4" width="20" height="16" rx="2.5" />
            <line x1="2" y1="9" x2="22" y2="9" />
            <circle cx="5.6" cy="6.6" r="0.9" {...dot} />
            <circle cx="8.6" cy="6.6" r="0.9" {...dot} />
          </>
        );
      case "database":
        return (
          <>
            <ellipse cx="12" cy="6" rx="8" ry="3" />
            <path d="M4,6 V18 a8,3 0 0 0 16,0 V6" />
            <path d="M4,12 a8,3 0 0 0 16,0" />
          </>
        );
      case "question":
        return (
          <>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M9.3,9.4 a2.8,2.8 0 1 1 3.5,2.7 c-0.85,0.28 -0.85,0.95 -0.85,1.55" />
            <circle cx="12" cy="16.6" r="0.85" {...dot} />
          </>
        );
      case "network":
        return (
          <>
            <circle cx="6" cy="7" r="2.4" />
            <circle cx="18" cy="7" r="2.4" />
            <circle cx="12" cy="18" r="2.4" />
            <path d="M7.6,8.8 L10.6,15.6 M16.4,8.8 L13.4,15.6 M8.4,7 H15.6" />
          </>
        );
      case "server":
        return (
          <>
            <rect x="3" y="4" width="18" height="6" rx="1.6" />
            <rect x="3" y="14" width="18" height="6" rx="1.6" />
            <circle cx="6.8" cy="7" r="0.9" {...dot} />
            <circle cx="6.8" cy="17" r="0.9" {...dot} />
          </>
        );
      case "document":
        return (
          <>
            <path d="M6,3 h7 l5,5 v12 a1,1 0 0 1 -1,1 H6 a1,1 0 0 1 -1,-1 V4 a1,1 0 0 1 1,-1 Z" />
            <path d="M13,3 v5 h5" />
            <line x1="8" y1="13" x2="15" y2="13" />
            <line x1="8" y1="16.5" x2="15" y2="16.5" />
          </>
        );
      case "clock":
        return (
          <>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12,7 V12 l3.4,2" />
          </>
        );
      case "return":
        return (
          <>
            <path d="M19,8 v2 a4,4 0 0 1 -4,4 H7" />
            <path d="M10.5,10.5 L6,14 L10.5,17.5" />
          </>
        );
    }
  };
  return (
    <g transform={`translate(${cx - 12}, ${cy - 12})`} {...common}>
      {inner()}
    </g>
  );
}

type FlowNode = {
  cx: number;
  lines: string[];
  titleY: number[];
  iconY: number;
  icon: IconKind;
  emphasis?: boolean;
} & ({ shape: "rect"; x: number; y: number; w: number; h: number } | { shape: "diamond"; cy: number });

const FLOW_NODES: FlowNode[] = [
  { shape: "rect", x: 30, y: 102, w: 112, h: 62, cx: 86, lines: ["Client Request"], titleY: [122], iconY: 139, icon: "browser" },
  { shape: "rect", x: 214, y: 102, w: 98, h: 62, cx: 263, lines: ["Check Caches"], titleY: [122], iconY: 139, icon: "database" },
  { shape: "diamond", cy: 133, cx: 446, lines: ["Is IP Cached?"], titleY: [130], iconY: 148, icon: "question", emphasis: true },
  { shape: "rect", x: 574, y: 25, w: 118, h: 62, cx: 633, lines: ["Query Root Server"], titleY: [45], iconY: 62, icon: "network" },
  { shape: "rect", x: 764, y: 25, w: 114, h: 62, cx: 821, lines: ["Query TLD Server"], titleY: [45], iconY: 62, icon: "server" },
  { shape: "rect", x: 950, y: 18, w: 127, h: 77, cx: 1013, lines: ["Query Authoritative", "Server"], titleY: [38, 52], iconY: 73, icon: "document" },
  { shape: "rect", x: 1149, y: 25, w: 92, h: 62, cx: 1195, lines: ["Cache Result"], titleY: [45], iconY: 62, icon: "clock" },
  { shape: "rect", x: 1313, y: 102, w: 71, h: 62, cx: 1348, lines: ["Return IP"], titleY: [122], iconY: 139, icon: "return", emphasis: true },
];

const FLOW_EDGES = [
  "M142,133 H206", // client → check
  "M312,133 H376", // check → decision
  "M446,95 V56 H566", // No → query root
  "M692,56 H756", // root → tld
  "M878,56 H942", // tld → auth
  "M1077,56 H1141", // auth → cache
  "M1241,56 H1348 V98", // cache → return (down)
  "M508,133 H1305", // Yes → return
];

const FLOW_STEPS: { n: string; t: string; d: string }[] = [
  { n: "01", t: "Client Request", d: "Your browser needs an IPv4 address for iamtaufeeq.cloud before it can open a connection." },
  { n: "02", t: "Check Caches", d: "It checks the browser, the OS stub resolver, then the recursive resolver — closest cache first." },
  { n: "03", t: "Is IP Cached?", d: "If any layer holds a fresh record within its TTL, the lookup ends here and the walk is skipped." },
  { n: "04", t: "Query Root Server", d: "On a miss the resolver asks a root server, which refers it to the .cloud TLD nameservers." },
  { n: "05", t: "Query TLD Server", d: "The .cloud TLD server returns the NS record naming the domain’s authoritative nameserver." },
  { n: "06", t: "Query Authoritative Server", d: "It gives the definitive answer — iamtaufeeq.cloud. 300 IN A 203.0.113.42 (an illustrative IP)." },
  { n: "07", t: "Cache Result", d: "The resolver stores the record for its TTL (300s) so repeat lookups return instantly." },
  { n: "08", t: "Return IP", d: "The address travels back to your browser, which connects straight to 203.0.113.42." },
];

function FlowDiagram() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <figure
      ref={ref}
      role="img"
      aria-label="DNS Resolution Process flowchart. A client request checks the caches, then a decision — is the IP cached? If yes, it returns the IP directly. If no, it queries the root server, the TLD server and the authoritative server, caches the result, and returns the IP."
      className="my-9 rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-6 max-[860px]:p-5"
    >
      <figcaption className="mb-5 flex items-center gap-2.5 text-[10.5px] font-bold uppercase tracking-[0.2em] text-faint">
        <span className="inline-block h-[13px] w-1 rounded-full bg-accent" />
        The DNS resolution process, end to end
      </figcaption>

      {/* wide flowchart — scrolls horizontally in its own container */}
      <div className="-mx-1 overflow-x-auto pb-1">
        <svg
          viewBox="0 6 1416 176"
          className={`block h-auto min-w-[940px] transition-opacity duration-700 ${inView ? "opacity-100" : "opacity-0"}`}
          style={{ fontFamily: "inherit" }}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <defs>
            <marker id="flow-arw" markerWidth="12" markerHeight="12" refX="7.5" refY="5" orient="auto">
              <path d="M1.5,1.5 L8,5 L1.5,8.5" fill="none" stroke="#c8ccd1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>

          {/* connectors */}
          <g stroke={FLOW_LINE} strokeWidth="2">
            {FLOW_EDGES.map((d, i) => (
              <path key={i} d={d} markerEnd="url(#flow-arw)" />
            ))}
          </g>

          {/* branch labels */}
          <text x="430" y="46" textAnchor="middle" fill="#c8ccd1" fontSize="11" fontWeight="700">No</text>
          <text x="560" y="125" textAnchor="middle" fill="#c8ccd1" fontSize="11" fontWeight="700">Yes</text>

          {/* nodes */}
          {FLOW_NODES.map((n, i) => {
            const fill = n.emphasis ? "rgba(148,242,60,0.11)" : "rgba(148,242,60,0.045)";
            const titleFill = n.emphasis ? FLOW_ACCENT : FLOW_INK;
            return (
              <g key={i}>
                {n.shape === "rect" ? (
                  <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="6" fill={fill} stroke={FLOW_ACCENT} strokeOpacity={n.emphasis ? 0.85 : 0.5} strokeWidth="2" />
                ) : (
                  <polygon
                    points={`${n.cx},${n.cy - 38} ${n.cx + 62},${n.cy} ${n.cx},${n.cy + 38} ${n.cx - 62},${n.cy}`}
                    fill={fill}
                    stroke={FLOW_ACCENT}
                    strokeOpacity={0.85}
                    strokeWidth="2"
                  />
                )}
                {n.lines.map((line, li) => (
                  <text key={li} x={n.cx} y={n.titleY[li]} textAnchor="middle" fill={titleFill} fontSize="12" fontWeight="600">
                    {line}
                  </text>
                ))}
                {flowIcon(n.icon, n.cx, n.iconY)}
              </g>
            );
          })}
        </svg>
      </div>

      {/* detailed step-by-step breakdown */}
      <ol className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3.5 border-t border-white/[0.06] pt-5 max-[560px]:grid-cols-1">
        {FLOW_STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 55} inView={inView}>
            <li className="flex gap-3">
              <span className="mt-[1px] font-mono text-[11px] font-bold text-accent">{s.n}</span>
              <div>
                <p className="font-display text-[13px] font-bold leading-tight text-ink">{s.t}</p>
                <p className="mt-0.5 text-[12.5px] leading-[1.55] text-muted">{s.d}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </figure>
  );
}

export default function BlogDiagram({ kind }: { kind: BlogDiagramKind }) {
  if (kind === "dns-resolution") return <ResolutionDiagram />;
  if (kind === "dns-caching") return <CachingDiagram />;
  if (kind === "dns-trace") return <TraceDiagram />;
  if (kind === "dns-flow") return <FlowDiagram />;
  return null;
}
