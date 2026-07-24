"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * System-architecture diagram — a minimal hierarchy "thread": a single vertical
 * spine links numbered tier dots top → bottom, each tier lists its nodes as
 * clean rows. On scroll into view the dots pop in, the spine draws down, the
 * node rows slide in, and a lime pulse streaks through the thread.
 *
 * Logos are resolved server-side and passed in as `logo`.
 */

type ArchNode = { name: string; detail?: string; logo?: string };
type ArchTier = { label: string; nodes: ArchNode[] };

const pad2 = (n: number) => String(n).padStart(2, "0");

export default function ArchitectureDiagram({ tiers }: { tiers: ArchTier[] }) {
  const ref = useRef<HTMLDivElement>(null);
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

  return (
    <div ref={ref} className={`atree ${inView ? "is-in" : ""}`}>
      {tiers.map((tier, i) => {
        const last = i === tiers.length - 1;
        const d = i * 140;
        return (
          <div className="atree-tier" key={`${tier.label}-${i}`}>
            <div className="atree-rail">
              <span
                className="atree-dot"
                style={{ "--d": `${d}ms` } as CSSProperties}
              >
                {pad2(i + 1)}
              </span>
              {!last && (
                <span
                  className="atree-line"
                  aria-hidden
                  style={{ "--d": `${d}ms` } as CSSProperties}
                >
                  <span className="atree-pulse" />
                </span>
              )}
            </div>

            <div className="atree-content">
              <p
                className="atree-label"
                style={{ "--d": `${d}ms` } as CSSProperties}
              >
                {tier.label}
              </p>
              <ul className="atree-nodes">
                {tier.nodes.map((node, j) => (
                  <li
                    className="atree-node"
                    key={`${node.name}-${j}`}
                    style={{ "--d": `${d + 90 + j * 60}ms` } as CSSProperties}
                  >
                    {node.logo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={node.logo}
                        alt=""
                        aria-hidden
                        className="atree-node-logo"
                      />
                    )}
                    <span className="atree-node-name">{node.name}</span>
                    {node.detail && (
                      <span className="atree-node-detail">{node.detail}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
