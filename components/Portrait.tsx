"use client";

import { useEffect, useState } from "react";

/**
 * Center portrait. Drop your photo in /public as portrait.png (or .jpg/.webp)
 * and it auto-replaces the placeholder.
 */
export default function Portrait() {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const candidates = [
      "/portrait.webp",
      "/portrait.png",
      "/portrait.jpg",
      "/portrait.jpeg",
    ];
    let i = 0;
    const tryNext = () => {
      if (i >= candidates.length) return;
      const img = new window.Image();
      img.onload = () => setSrc(candidates[i]);
      img.onerror = () => {
        i += 1;
        tryNext();
      };
      img.src = candidates[i];
    };
    tryNext();
  }, []);

  return (
    <div
      className="portrait-mask absolute left-1/2 top-[120px] z-[2] aspect-[71/201] w-[clamp(220px,27vw,340px)] -translate-x-1/2 bg-contain bg-bottom bg-no-repeat max-[860px]:static max-[860px]:mx-auto max-[860px]:mt-6 max-[860px]:w-[clamp(150px,52vw,190px)] max-[860px]:translate-x-0"
      style={src ? { backgroundImage: `url('${src}')` } : undefined}
    >
      {!src && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2.5 rounded-[18px] border-[1.5px] border-dashed border-white/10 bg-white/[0.015] text-center text-faint">
          <span className="text-5xl text-accent/80">⌭</span>
          <p className="text-sm font-semibold text-muted">Your photo goes here</p>
          <small className="text-[11.5px]">
            Drop it in <code className="rounded-md bg-accent/15 px-1.5 py-px text-[11px] text-accent">public/portrait.png</code>
          </small>
        </div>
      )}
    </div>
  );
}
