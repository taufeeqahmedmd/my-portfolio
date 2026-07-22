"use client";

import { useEffect, useRef, useState } from "react";

/** Fixed destination. */
const DEST = { name: "Uppal, Hyderabad", lat: 17.4058, lng: 78.559 };

type Status = "loading" | "granted" | "denied";
type Coords = { lat: number; lng: number };
type Route = { latlngs: [number, number][]; distanceKm: number; durationMin: number };

function haversineKm(a: Coords, b: Coords): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

/* Load Leaflet from CDN once (avoids a build dependency). */
function loadLeaflet(): Promise<any> {
  const w = window as unknown as { L?: unknown };
  if (w.L) return Promise.resolve(w.L);
  return new Promise((resolve, reject) => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    const existing = document.getElementById("leaflet-js") as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve((window as unknown as { L: unknown }).L));
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.id = "leaflet-js";
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => resolve((window as unknown as { L: unknown }).L);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function Dot({ kind }: { kind: string }) {
  const base = "relative z-10 h-[16px] w-[16px] flex-shrink-0 rounded-full";
  if (kind === "dest")
    return <span className={`${base} bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.1)]`} />;
  if (kind === "active")
    return (
      <span className={`${base} border-[3px] border-white bg-[#0c0d0f] shadow-[0_0_0_4px_rgba(148,242,60,0.25)]`} />
    );
  return (
    <span className={`${base} grid place-items-center border border-white/25 bg-[#0c0d0f]`}>
      <span className="h-[7px] w-[7px] rounded-full bg-accent" />
    </span>
  );
}

export default function NavCard() {
  const [status, setStatus] = useState<Status>("loading");
  const [coords, setCoords] = useState<Coords | null>(null);
  const [area, setArea] = useState<string | null>(null);
  const [route, setRoute] = useState<Route | null>(null);

  const mapEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("denied");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (!active) return;
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        setStatus("granted");

        // area name
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`)
          .then((r) => (r.ok ? r.json() : null))
          .then((j) => {
            if (!active || !j) return;
            const loc: string | undefined = j.locality || undefined;
            const city: string | undefined = j.city || undefined;
            const label = loc && city && loc !== city ? `${loc}, ${city}` : loc || city || j.principalSubdivision || null;
            if (label) setArea(label);
          })
          .catch(() => {});

        // real driving route via OSRM (fallback: straight line)
        try {
          const r = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${lng},${lat};${DEST.lng},${DEST.lat}?overview=full&geometries=geojson`
          );
          const j = await r.json();
          if (active && j.code === "Ok" && j.routes?.[0]) {
            const rt = j.routes[0];
            const latlngs: [number, number][] = rt.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
            setRoute({ latlngs, distanceKm: rt.distance / 1000, durationMin: rt.duration / 60 });
            return;
          }
          throw new Error("no route");
        } catch {
          if (!active) return;
          const distanceKm = haversineKm({ lat, lng }, DEST);
          setRoute({
            latlngs: [
              [lat, lng],
              [DEST.lat, DEST.lng],
            ],
            distanceKm,
            durationMin: (distanceKm / 32) * 60,
          });
        }
      },
      () => {
        if (active) setStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
    return () => {
      active = false;
    };
  }, []);

  // init the map once we have coords + a route
  useEffect(() => {
    if (status !== "granted" || !coords || !route || !mapEl.current) return;
    let disposed = false;
    let map: any;
    (async () => {
      let L: any;
      try {
        L = await loadLeaflet();
      } catch {
        return;
      }
      if (disposed || !mapEl.current) return;
      map = L.map(mapEl.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false,
        tap: false,
        inertia: false,
      });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png", {
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      // route: soft glow under a bright line
      L.polyline(route.latlngs, { color: "#94f23c", weight: 9, opacity: 0.22, lineCap: "round", lineJoin: "round" }).addTo(map);
      L.polyline(route.latlngs, { color: "#a6f24f", weight: 4, opacity: 0.95, lineCap: "round", lineJoin: "round" }).addTo(map);

      // markers
      L.circleMarker([DEST.lat, DEST.lng], { radius: 6, color: "#ffffff", weight: 2.5, fillColor: "#ffffff", fillOpacity: 1 }).addTo(map);
      L.circleMarker([coords.lat, coords.lng], { radius: 6, color: "#0c0d0f", weight: 2.5, fillColor: "#94f23c", fillOpacity: 1 }).addTo(map);

      // fit the route, biased right so the timeline panel doesn't cover it
      const leftPad = Math.round((mapEl.current.clientWidth || 300) * 0.44);
      map.fitBounds(L.latLngBounds(route.latlngs), { paddingTopLeft: [leftPad, 26], paddingBottomRight: [26, 30] });
      setTimeout(() => {
        if (!disposed && map) map.invalidateSize();
      }, 60);
    })();
    return () => {
      disposed = true;
      if (map) map.remove();
    };
  }, [status, coords, route]);

  if (status !== "granted" || !coords) return null;

  const distanceKm = route ? route.distanceKm : haversineKm(coords, DEST);
  const distLabel = distanceKm < 10 ? distanceKm.toFixed(1) : Math.round(distanceKm).toString();
  const etaMin = Math.max(1, Math.round(route ? route.durationMin : (distanceKm / 32) * 60));

  const steps: { kind: string; eyebrow: string; title: string }[] = [
    { kind: "dest", eyebrow: "Destination", title: DEST.name },
    { kind: "active", eyebrow: "Fastest route", title: `${distLabel} km away` },
    { kind: "you", eyebrow: "Live position", title: area ?? "Your location" },
  ];

  return (
    <div className="w-full animate-[fadeIn_0.6s_ease]">
      <div className="relative h-[248px] w-full overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#0c0d0f] shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
        {/* real map */}
        <div ref={mapEl} className="absolute inset-0 z-0" style={{ background: "#0c0d0f" }} />

        {/* legibility gradient over the left side */}
        <div className="pointer-events-none absolute inset-0 z-[5] bg-[linear-gradient(90deg,#0c0d0f_30%,rgba(12,13,15,0.35)_54%,transparent_82%)]" />

        {/* content */}
        <div className="pointer-events-none relative z-10 flex h-full flex-col p-5">
          <div className="mb-1 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/60">Live route</span>
          </div>

          <ol className="relative flex flex-1 flex-col justify-between py-2.5">
            <span aria-hidden className="absolute bottom-[16px] left-2 top-[16px] w-px border-l border-dashed border-white/25" />
            {steps.map((s, i) => (
              <li key={i} className="relative flex items-center gap-3">
                <Dot kind={s.kind} />
                <div>
                  <p className="text-[8.5px] font-semibold uppercase tracking-[0.14em] text-white/45">{s.eyebrow}</p>
                  <p className={`text-[13px] leading-tight ${s.kind === "active" ? "font-bold text-white" : "font-semibold text-white/95"}`}>
                    {s.title}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* ETA */}
        <div className="absolute bottom-4 right-5 z-10 text-right">
          <div className="font-display text-[28px] font-bold leading-none text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
            {etaMin}
          </div>
          <div className="text-[10.5px] text-white/70">minutes</div>
        </div>

        {/* attribution (required by OSM / CARTO) */}
        <span className="absolute bottom-1 left-2.5 z-[6] text-[7.5px] text-white/25">© OpenStreetMap · CARTO</span>
      </div>
    </div>
  );
}
