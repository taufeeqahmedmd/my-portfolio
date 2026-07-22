import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOGS, getBlog, fmtDate } from "@/lib/blogs";
import JsonLd from "@/components/JsonLd";
import { blogPostingSchema, breadcrumb } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOGS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const b = getBlog(slug);
  if (!b) return { title: "Article" };
  const path = `/blog/${b.slug}`;
  return {
    title: b.title,
    description: b.excerpt,
    keywords: [...b.tags, b.category, "Mohammed Taufeeq Ahmed", "Taufeeq"],
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: b.title,
      description: b.excerpt,
      url: path,
      siteName: "Mohammed Taufeeq Ahmed",
      publishedTime: b.date,
      modifiedTime: b.date,
      authors: ["Mohammed Taufeeq Ahmed"],
      section: b.category,
      tags: b.tags,
    },
    twitter: { card: "summary_large_image", title: b.title, description: b.excerpt },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = getBlog(slug);
  if (!blog) notFound();

  const idx = BLOGS.findIndex((b) => b.slug === slug);
  const next = BLOGS[(idx + 1) % BLOGS.length];

  return (
    <main className="relative isolate mx-auto max-w-[760px] px-9 pb-28 pt-8 max-[860px]:px-5 max-[860px]:pb-20">
      <JsonLd data={blogPostingSchema(blog)} />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Writing", path: "/blog" },
          { name: blog.title, path: `/blog/${blog.slug}` },
        ])}
      />
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-140px] -z-10 h-[400px] w-[860px] max-w-[130vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(148,242,60,0.12),transparent_65%)] blur-[36px]"
      />

      {/* top bar */}
      <Link
        href="/blog"
        className="group inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] py-2 pl-3 pr-4 text-[12.5px] font-semibold text-muted no-underline backdrop-blur transition-all duration-200 hover:border-accent/40 hover:text-ink"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:-translate-x-0.5">
          <path d="M15 5l-7 7 7 7" />
        </svg>
        All articles
      </Link>

      {/* header */}
      <header className="mt-10">
        <div className="mb-4 flex flex-wrap items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em]">
          <span className="text-accent">{blog.category}</span>
          <span className="text-white/20">·</span>
          <span className="text-faint">{fmtDate(blog.date)}</span>
          <span className="text-white/20">·</span>
          <span className="text-faint">{blog.readMins} min read</span>
        </div>
        <h1 className="font-display text-[clamp(28px,4.4vw,44px)] font-black uppercase leading-[1.04] tracking-[-0.01em] text-ink">
          {blog.title}
        </h1>
        <p className="mt-5 text-[clamp(15px,1.6vw,18px)] font-light leading-[1.7] text-[#b9bcc0]">{blog.intro}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {blog.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[11.5px] font-medium text-[#d8dadd]"
            >
              {t}
            </span>
          ))}
        </div>
      </header>

      <hr className="my-10 border-0 border-t border-white/[0.08]" />

      {/* body */}
      <article className="flex flex-col gap-10">
        {blog.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="flex items-center gap-2.5 font-display text-[19px] font-extrabold uppercase tracking-[0.03em] text-ink">
              <span className="inline-block h-[16px] w-1 rounded-full bg-accent" />
              {s.heading}
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              {s.body.map((p, i) => (
                <p key={i} className="text-[15px] leading-[1.8] text-[#c4c7cb]">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </article>

      {/* next article */}
      <nav className="mt-14 border-t border-white/[0.08] pt-8">
        <Link
          href={`/blog/${next.slug}`}
          className="group block rounded-[18px] border border-white/[0.08] bg-white/[0.02] p-5 no-underline transition-all duration-300 hover:border-accent/40 hover:bg-accent/[0.04]"
        >
          <span className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-faint">Next article →</span>
          <p className="mt-1.5 font-display text-[16px] font-bold text-ink transition-colors group-hover:text-accent">{next.title}</p>
        </Link>
      </nav>
    </main>
  );
}
