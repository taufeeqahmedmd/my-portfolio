/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

// Enables the Cloudflare Workers runtime (bindings, env) during `next dev`.
// No-op in production builds.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
