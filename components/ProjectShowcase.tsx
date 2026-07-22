"use client";

import { useState } from "react";
import Link from "next/link";
import { KEY_PROJECTS, PERSONAL_PROJECTS, techLogo, type Project } from "@/lib/projects";

const pad2 = (n: number) => String(n).padStart(2, "0");
const ALL: Project[] = [...KEY_PROJECTS, ...PERSONAL_PROJECTS];

function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function TechRow({ tech }: { tech: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tech.map((t) => {
        const logo = techLogo(t);
        return logo ? (
          <span
            key={t}
            title={t}
            className="grid h-[26px] w-[26px] flex-shrink-0 place-items-center rounded-[7px] border border-white/[0.08] bg-white/[0.04]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt={t} className="h-[15px] w-[15px] object-contain" />
          </span>
        ) : (
          <span
            key={t}
            className="inline-flex h-[26px] flex-shrink-0 items-center rounded-[7px] border border-white/[0.08] bg-white/[0.04] px-2.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-faint"
          >
            {t}
          </span>
        );
      })}
    </div>
  );
}

function ListItem({
  project,
  i,
  active,
  onHover,
}: {
  project: Project;
  i: number;
  active: boolean;
  onHover: () => void;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      onMouseEnter={onHover}
      onFocus={onHover}
      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 no-underline transition-colors duration-200 ${
        active ? "bg-accent/[0.1]" : "hover:bg-white/[0.03]"
      }`}
    >
      <span
        className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-accent transition-opacity duration-200 ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />
      <span className={`font-display text-[11px] font-bold transition-colors ${active ? "text-accent" : "text-faint"}`}>
        {pad2(i + 1)}
      </span>
      <span
        className={`flex-1 truncate text-[13.5px] font-semibold transition-colors ${
          active ? "text-ink" : "text-muted group-hover:text-ink"
        }`}
      >
        {project.title}
      </span>
      <span
        className={`text-accent transition-all duration-200 ${active ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"}`}
      >
        <ArrowUpRight />
      </span>
    </Link>
  );
}

/* ---- mobile card (≤760px): the desktop master/detail view can't work on a
   phone, so each project becomes a self-contained, tappable card that carries
   its category, summary and stack — not just a bare title. ---- */
function MobileProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex flex-col gap-3 rounded-[18px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.012))] p-[18px] no-underline shadow-[0_16px_38px_-24px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.05)] transition-colors duration-200 active:border-accent/45"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
          <span className="font-display text-faint">{pad2(index + 1)}</span>
          {project.category}
        </span>
        {project.tag && (
          <span className="flex-shrink-0 rounded-full border border-accent/30 bg-accent/10 px-2 py-[2px] text-[9.5px] font-bold uppercase tracking-wide text-accent">
            {project.tag}
          </span>
        )}
      </div>

      <h3 className="font-display text-[17px] font-black uppercase leading-[1.12] tracking-[-0.01em] text-ink">
        {project.title}
      </h3>

      <p className="text-[12.5px] leading-[1.6] text-muted line-clamp-3">{project.summary}</p>

      <div className="mt-0.5">
        <TechRow tech={project.tech.slice(0, 6)} />
      </div>

      <span className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-accent">
        View project
        <ArrowUpRight />
      </span>
    </Link>
  );
}

export default function ProjectShowcase() {
  const [active, setActive] = useState(0);
  const p = ALL[active];

  return (
    <>
    {/* mobile: stacked cards */}
    <div data-reveal className="reveal hidden flex-col gap-3.5 max-[760px]:flex">
      <p className="px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-faint/80">Key Projects</p>
      {KEY_PROJECTS.map((proj, i) => (
        <MobileProjectCard key={proj.slug} project={proj} index={i} />
      ))}
      <p className="mt-1.5 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-faint/80">
        Personal <span className="text-faint/60">· Learning</span>
      </p>
      {PERSONAL_PROJECTS.map((proj, i) => (
        <MobileProjectCard key={proj.slug} project={proj} index={KEY_PROJECTS.length + i} />
      ))}
    </div>

    {/* desktop: master / detail */}
    <div
      data-reveal
      className="reveal grid grid-cols-[minmax(210px,0.85fr)_1.15fr] overflow-hidden rounded-[22px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.01))] shadow-[0_28px_70px_-24px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-[16px] max-[760px]:hidden"
    >
      {/* left — index list */}
      <div className="border-r border-white/[0.07] p-3 max-[760px]:border-b max-[760px]:border-r-0">
        <p className="px-3 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-faint/80">Key Projects</p>
        {KEY_PROJECTS.map((proj, i) => (
          <ListItem key={proj.slug} project={proj} i={i} active={active === i} onHover={() => setActive(i)} />
        ))}
        <p className="px-3 pb-1.5 pt-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-faint/80">
          Personal <span className="text-faint/60">· Learning</span>
        </p>
        {PERSONAL_PROJECTS.map((proj, i) => {
          const gi = KEY_PROJECTS.length + i;
          return (
            <ListItem key={proj.slug} project={proj} i={gi} active={active === gi} onHover={() => setActive(gi)} />
          );
        })}
      </div>

      {/* right — active detail */}
      <div className="relative min-h-[340px] p-7 max-[760px]:hidden">
        <span
          aria-hidden
          className="pointer-events-none absolute right-6 top-3 select-none font-display text-[92px] font-black leading-none tracking-tighter text-white/[0.04]"
        >
          {pad2(active + 1)}
        </span>

        <div key={active} className="flex h-full animate-[fadeIn_0.4s_ease] flex-col">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.28em] text-accent">{p.category}</span>
            {p.tag && (
              <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-[2px] text-[9.5px] font-bold uppercase tracking-wide text-accent">
                {p.tag}
              </span>
            )}
          </div>

          <h3 className="font-display text-[clamp(20px,2.4vw,28px)] font-black uppercase leading-[1.05] tracking-[-0.01em] text-ink">
            {p.title}
          </h3>
          <p className="mt-3 max-w-[52ch] text-[13px] leading-[1.65] text-muted">{p.summary}</p>

          <div className="mt-auto flex flex-col gap-4 pt-6">
            <div>
              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-faint/70">Stack</p>
              <TechRow tech={p.tech} />
            </div>
            {p.infra && p.infra.length > 0 && (
              <div>
                <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-faint/70">Infrastructure</p>
                <TechRow tech={p.infra} />
              </div>
            )}
            <Link
              href={`/projects/${p.slug}`}
              className="group mt-1 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-ink no-underline transition-colors hover:text-accent"
            >
              View project
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                <ArrowUpRight />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
