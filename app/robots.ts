import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Major AI crawlers — explicitly allowed so the site can appear in AI answers. */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "Claude-SearchBot",
  "Google-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "CCBot",
  "Applebot",
  "Applebot-Extended",
  "Amazonbot",
  "Bytespider",
  "cohere-ai",
  "Diffbot",
  "Meta-ExternalAgent",
  "meta-externalagent",
  "FacebookBot",
  "YouBot",
  "DuckAssistBot",
  "Timpibot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Explicitly welcome AI crawlers (redundant with "*" but signals intent
      // and overrides any AI-blocking defaults some tools assume).
      { userAgent: AI_CRAWLERS, allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
