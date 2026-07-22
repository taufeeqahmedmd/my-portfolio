import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Default Cloudflare config. This static/SSG portfolio needs no incremental
// cache, tag cache, or queue — add them here later if ISR/on-demand
// revalidation is introduced. See https://opennext.js.org/cloudflare/caching
export default defineCloudflareConfig();
