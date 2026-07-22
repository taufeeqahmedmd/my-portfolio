"use client";

import { useState, type CSSProperties } from "react";

/**
 * Auto-scrolling tech pills. Each row scrolls infinitely (opposite directions);
 * hovering anywhere pauses all rows, and each pill lights up on hover.
 */
export default function TechMarquee({ rows }: { rows: string[][] }) {
  const [paused, setPaused] = useState(false);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="flex flex-col gap-2.5"
    >
      {rows.map((row, i) => (
        <div key={i} className="tech-marquee">
          <div
            className={`tech-marquee-track ${i % 2 === 1 ? "is-reverse" : ""} ${paused ? "is-paused" : ""}`}
            style={{ "--marquee-dur": `${30 + i * 8}s` } as CSSProperties}
          >
            {[...row, ...row].map((t, j) => (
              <span
                key={`${t}-${j}`}
                aria-hidden={j >= row.length}
                className="shrink-0 whitespace-nowrap rounded-full border border-white/[0.07] bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium text-[#d8dadd] transition-colors duration-200 hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
