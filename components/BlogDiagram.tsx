"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Native, theme-matched diagrams for blog posts — inline SVG/CSS only, no
 * raster assets. Each diagram reveals on scroll (numbered dots pop in, the
 * spine draws down, rows slide in), mirroring the ArchitectureDiagram language.
 *
 * Add a diagram to a blog section with `diagram: "<kind>"` in lib/blogs.ts.
 */

export type BlogDiagramKind = "dns-resolution" | "dns-caching" | "dns-trace";

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

export default function BlogDiagram({ kind }: { kind: BlogDiagramKind }) {
  if (kind === "dns-resolution") return <ResolutionDiagram />;
  if (kind === "dns-caching") return <CachingDiagram />;
  if (kind === "dns-trace") return <TraceDiagram />;
  return null;
}
