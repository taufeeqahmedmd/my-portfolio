import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// This site is fully static/SSG (all `/blog/[slug]` and `/projects/[slug]`
// pages are prerendered at build time; nothing revalidates at runtime).
// Serve those prerendered pages from Workers static assets — without an
// incremental cache the worker can't read them and every dynamic route 404s.
const config = defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});

// Run the plain Next.js build via a dedicated script. Without this, OpenNext
// defaults to `npm run build` — and since the "build" script IS
// `opennextjs-cloudflare build`, that would recurse infinitely. Using
// `build:next` (→ `next build`) keeps Cloudflare's `npm run build` working
// with no dashboard changes.
config.buildCommand = "npm run build:next";

export default config;
