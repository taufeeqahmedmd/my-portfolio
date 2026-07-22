"use client";

import { useEffect, useState } from "react";

const USER = "taufeeqahmedmd";
const CELL = 11; // px
const GAP = 3; // px
const PITCH = CELL + GAP;
const WD_W = 26; // weekday label column width

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LEVELS = ["bg-white/[0.05]", "bg-accent/25", "bg-accent/45", "bg-accent/75", "bg-accent"];

type Day = { date: string; count: number; level: number };
type Contrib = { days: Day[]; total: number };

function buildWeeks(days: Day[]) {
  const weeks: (Day | null)[][] = [];
  let week: (Day | null)[] = [];
  if (days.length) {
    const firstDow = new Date(days[0].date + "T12:00:00").getDay();
    for (let k = 0; k < firstDow; k += 1) week.push(null);
  }
  for (const d of days) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  const marks: { wi: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((w, wi) => {
    const first = w.find((d) => d);
    if (!first) return;
    const m = new Date(first.date + "T12:00:00").getMonth();
    if (m !== lastMonth) {
      marks.push({ wi, label: MONTHS[m] });
      lastMonth = m;
    }
  });
  return { weeks, marks };
}

export default function GithubActivity() {
  const [contrib, setContrib] = useState<Contrib | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`);
        if (!r.ok) throw new Error("contrib failed");
        const j = await r.json();
        const days: Day[] = Array.isArray(j.contributions) ? j.contributions : [];
        if (!cancelled) setContrib({ days, total: days.reduce((s, d) => s + d.count, 0) });
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const profileUrl = `https://github.com/${USER}`;

  return (
    <section
      data-reveal
      className="reveal rounded-[22px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))] p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[14px] max-[860px]:p-5"
    >
      {/* header */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="text-ink">
            <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.74 1.27 3.41.97.1-.76.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.42.37.79 1.09.79 2.2v3.26c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
          </svg>
          <h2 className="font-display text-[16px] font-extrabold uppercase tracking-[0.05em] text-ink">
            GitHub <span className="text-accent">Activity</span>
          </h2>
        </div>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted no-underline transition-colors hover:text-accent"
        >
          @{USER}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </a>
      </div>

      {error ? (
        <p className="py-6 text-center text-[13px] text-faint">
          Couldn&apos;t load GitHub data right now.{" "}
          <a href={profileUrl} target="_blank" rel="noopener" className="text-accent underline underline-offset-2">
            View profile
          </a>
        </p>
      ) : !contrib ? (
        <div className="animate-pulse">
          <div className="h-[124px] rounded-[10px] bg-white/[0.03]" />
        </div>
      ) : (
        <>
          <p className="mb-3 text-[12px] text-faint">
            <span className="font-semibold text-muted">{contrib.total}</span> contributions in the last year
          </p>
          <Heatmap days={contrib.days} />
        </>
      )}
    </section>
  );
}

function Heatmap({ days }: { days: Day[] }) {
  const { weeks, marks } = buildWeeks(days);
  const gridH = 7 * CELL + 6 * GAP;
  const weekdays = ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <div className="themed-scroll overflow-x-auto pb-2">
      <div className="inline-flex flex-col">
        {/* month labels (offset by weekday column) */}
        <div className="flex">
          <div style={{ width: WD_W }} />
          <div className="relative h-3.5" style={{ width: weeks.length * PITCH }}>
            {marks.map((m) => (
              <span key={m.wi} className="absolute whitespace-nowrap text-[9.5px] text-faint" style={{ left: m.wi * PITCH }}>
                {m.label}
              </span>
            ))}
          </div>
        </div>

        {/* weekday labels + grid */}
        <div className="flex">
          <div className="flex flex-col" style={{ width: WD_W, gap: GAP }}>
            {weekdays.map((l, i) => (
              <span key={i} className="flex items-center text-[9.5px] leading-none text-faint" style={{ height: CELL }}>
                {l}
              </span>
            ))}
          </div>

          <div className="flex" style={{ gap: GAP, height: gridH }}>
            {weeks.map((w, wi) => (
              <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                {w.map((d, di) => (
                  <span
                    key={di}
                    title={d ? `${d.count} contribution${d.count === 1 ? "" : "s"} on ${d.date}` : ""}
                    className={`rounded-[2px] ${d ? LEVELS[d.level] ?? LEVELS[0] : "bg-transparent"}`}
                    style={{ width: CELL, height: CELL }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* legend */}
        <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-faint" style={{ paddingLeft: WD_W }}>
          <span>Less</span>
          {LEVELS.map((lv, i) => (
            <span key={i} className={`rounded-[2px] ${lv}`} style={{ width: CELL, height: CELL }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
