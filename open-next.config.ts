import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Default Cloudflare config. This static/SSG portfolio needs no incremental
// cache, tag cache, or queue — add them here later if ISR/on-demand
// revalidation is introduced. See https://opennext.js.org/cloudflare/caching
const config = defineCloudflareConfig();

// Run the plain Next.js build via a dedicated script. Without this, OpenNext
// defaults to `npm run build` — and since the "build" script IS
// `opennextjs-cloudflare build`, that would recurse infinitely. Using
// `build:next` (→ `next build`) keeps Cloudflare's `npm run build` working
// with no dashboard changes.
config.buildCommand = "npm run build:next";

export default config;
