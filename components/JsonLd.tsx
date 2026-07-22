/**
 * Renders a JSON-LD structured-data script. Server component — the JSON is
 * inlined into the prerendered HTML so crawlers (and AI agents) read it directly.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here; escape the closing tag just in case.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
