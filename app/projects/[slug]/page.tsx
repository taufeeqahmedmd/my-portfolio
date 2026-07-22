import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_PROJECTS, getProject, techLogo } from "@/lib/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return { title: "Project — Mohammed Taufeeq Ahmed" };
  return {
    title: `${p.title} — Mohammed Taufeeq Ahmed`,
    description: p.summary,
  };
}

/* ---- premium surface tokens ---- */
const cardBase =
  "relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.012))] shadow-[0_28px_70px_-24px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-[16px]";

const pad2 = (n: number) => String(n).padStart(2, "0");

function SectionHead({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-[17px] font-extrabold uppercase tracking-[0.05em] text-ink">{children}</h2>
  );
}

function TechChip({ name }: { name: string }) {
  const logo = techLogo(name);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] py-1.5 text-[12px] font-medium text-[#d8dadd] transition-colors hover:border-white/20 hover:bg-white/[0.07] ${logo ? "pl-2 pr-3.5" : "px-3.5"}`}
    >
      {logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt="" aria-hidden className="h-4 w-4 flex-shrink-0 object-contain" />
      )}
      {name}
    </span>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const total = ALL_PROJECTS.length;
  const idx = ALL_PROJECTS.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? ALL_PROJECTS[idx - 1] : null;
  const next = idx < ALL_PROJECTS.length - 1 ? ALL_PROJECTS[idx + 1] : null;

  // Rich projects define `sections`; simple ones fall back to a single Highlights list.
  const sections =
    project.sections ?? [{ title: "Highlights", items: project.highlights }];

  return (
    <main className="relative isolate mx-auto max-w-[1120px] px-9 pb-24 pt-8 max-[860px]:px-5 max-[860px]:pb-16">
      {/* ambient accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-140px] -z-10 h-[420px] w-[960px] max-w-[130vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(148,242,60,0.13),transparent_65%)] blur-[36px]"
      />

      {/* top bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/#resume"
          className="group inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] py-2 pl-3 pr-4 text-[12.5px] font-semibold text-muted no-underline backdrop-blur transition-all duration-200 hover:border-accent/40 hover:text-ink"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          >
            <path d="M15 5l-7 7 7 7" />
          </svg>
          Back to portfolio
        </Link>
        <span className="font-display text-[13px] font-bold tracking-[0.22em] text-faint">
          <span className="text-accent">{pad2(idx + 1)}</span>
          <span className="mx-1 text-white/20">/</span>
          {pad2(total)}
        </span>
      </div>

      {/* hero */}
      <header className="relative mt-16 max-[860px]:mt-11">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-12 right-0 select-none font-display text-[clamp(96px,15vw,200px)] font-black leading-none tracking-tighter text-white/[0.035] max-[860px]:hidden"
        >
          {pad2(idx + 1)}
        </span>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2.5 text-[11.5px] font-bold uppercase tracking-[0.32em] text-accent">
            <span className="h-px w-9 bg-gradient-to-r from-accent to-accent/20" />
            {project.category}
          </span>
          {project.tag && (
            <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-[0.12em] text-accent shadow-[0_0_18px_rgba(148,242,60,0.16)]">
              {project.tag}
            </span>
          )}
        </div>

        <h1 className="max-w-[17ch] bg-[linear-gradient(180deg,#ffffff_28%,#a6a9ae)] bg-clip-text font-display text-[clamp(34px,6vw,66px)] font-black uppercase leading-[0.96] tracking-[-0.02em] text-transparent">
          {project.title}
        </h1>

        <p className="mt-6 max-w-[60ch] text-[clamp(15px,1.6vw,18px)] font-light leading-[1.7] text-[#b9bcc0]">
          {project.summary}
        </p>
      </header>

      {/* content */}
      <div className="mt-14 grid grid-cols-[300px_1fr] gap-10 max-[960px]:grid-cols-1 max-[960px]:gap-8 max-[860px]:mt-11">
        {/* sticky details rail */}
        <aside>
          <div className="sticky top-8 flex flex-col gap-5">
            <div className={`${cardBase} p-6`}>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-faint">Details</p>
              <dl className="mt-4 flex flex-col divide-y divide-white/[0.06]">
                <div className="py-3 first:pt-0">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-faint">Category</dt>
                  <dd className="mt-1 text-[13.5px] font-semibold text-ink">{project.category}</dd>
                </div>
                {project.role && (
                  <div className="py-3">
                    <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-faint">Role</dt>
                    <dd className="mt-1 text-[13.5px] font-semibold text-ink">{project.role}</dd>
                  </div>
                )}
                {project.timeframe && (
                  <div className="py-3">
                    <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-faint">Timeline</dt>
                    <dd className="mt-1 text-[13.5px] font-semibold text-ink">{project.timeframe}</dd>
                  </div>
                )}
              </dl>

              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.28em] text-faint">Tech Stack</p>
              <div className="mt-3.5 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <TechChip key={t} name={t} />
                ))}
              </div>

              {project.infra && project.infra.length > 0 && (
                <>
                  <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.28em] text-faint">Infrastructure</p>
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    {project.infra.map((t) => (
                      <TechChip key={t} name={t} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>

        {/* main column */}
        <div className="flex min-w-0 flex-col gap-7">
          {/* overview lead */}
          <section className="relative pl-6 max-[560px]:pl-5">
            <span className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-[3px] rounded-full bg-gradient-to-b from-accent to-accent/5" />
            <p className="text-[clamp(15px,1.5vw,17px)] font-light leading-[1.8] text-[#c4c7cb]">
              {project.overview}
            </p>
          </section>

          {/* at a glance */}
          {project.stack && (
            <section className={`${cardBase} p-7 max-[560px]:p-5`}>
              <SectionHead>At a Glance</SectionHead>
              <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-5 max-[560px]:grid-cols-1 max-[560px]:gap-y-4">
                {project.stack.map((row) => (
                  <div key={row.label} className="border-l border-white/[0.09] pl-4">
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-accent">{row.label}</p>
                    <p className="mt-1.5 text-[13px] leading-[1.5] text-[#c4c7cb]">{row.value}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* sections */}
          {sections.map((sec, i) => (
            <section key={sec.title} className={`${cardBase} p-7 max-[560px]:p-5`}>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-[13px] font-black tracking-[0.12em] text-accent/70">{pad2(i + 1)}</span>
                <SectionHead>{sec.title}</SectionHead>
              </div>
              <ul className="mt-5 flex flex-col gap-3">
                {sec.items.map((item, j) => (
                  <li key={j} className="flex gap-3.5 text-[13.5px] leading-[1.65] text-[#c0c3c7]">
                    <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rotate-45 rounded-[1px] bg-accent/80 shadow-[0_0_8px_rgba(148,242,60,0.4)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      {/* prev / next */}
      <nav className="mt-16 grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
        {prev ? (
          <Link
            href={`/projects/${prev.slug}`}
            className="group relative overflow-hidden rounded-[18px] border border-white/[0.08] bg-white/[0.02] p-5 no-underline transition-all duration-300 hover:border-accent/40 hover:bg-accent/[0.05]"
          >
            <span className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-faint">← Previous</span>
            <p className="mt-1.5 font-display text-[15px] font-bold text-ink transition-colors group-hover:text-accent">{prev.title}</p>
          </Link>
        ) : (
          <span className="max-[560px]:hidden" />
        )}
        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            className="group relative overflow-hidden rounded-[18px] border border-white/[0.08] bg-white/[0.02] p-5 text-right no-underline transition-all duration-300 hover:border-accent/40 hover:bg-accent/[0.05] max-[560px]:text-left"
          >
            <span className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-faint">Next →</span>
            <p className="mt-1.5 font-display text-[15px] font-bold text-ink transition-colors group-hover:text-accent">{next.title}</p>
          </Link>
        ) : (
          <span className="max-[560px]:hidden" />
        )}
      </nav>

      <div className="mt-9 text-center">
        <Link
          href="/#resume"
          className="text-[11.5px] font-bold uppercase tracking-[0.24em] text-faint no-underline transition-colors hover:text-accent"
        >
          View all projects
        </Link>
      </div>
    </main>
  );
}
