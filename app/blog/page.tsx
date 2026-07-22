import type { Metadata } from "next";
import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import { BLOGS } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Writing — Mohammed Taufeeq Ahmed",
  description: "Articles on Cloud, AWS, DevOps, and AI by Mohammed Taufeeq Ahmed.",
};

export default function BlogIndex() {
  return (
    <main className="relative isolate mx-auto max-w-[1120px] px-9 pb-28 pt-8 max-[860px]:px-5 max-[860px]:pb-20">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-140px] -z-10 h-[420px] w-[960px] max-w-[130vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(148,242,60,0.12),transparent_65%)] blur-[36px]"
      />

      {/* top bar */}
      <Link
        href="/#resume"
        className="group inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] py-2 pl-3 pr-4 text-[12.5px] font-semibold text-muted no-underline backdrop-blur transition-all duration-200 hover:border-accent/40 hover:text-ink"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:-translate-x-0.5">
          <path d="M15 5l-7 7 7 7" />
        </svg>
        Back to portfolio
      </Link>

      {/* header */}
      <header className="mt-14 max-[860px]:mt-11">
        <p className="mb-4 inline-flex items-center gap-2.5 text-[11.5px] font-bold uppercase tracking-[0.32em] text-accent">
          <span className="h-px w-9 bg-gradient-to-r from-accent to-accent/20" />
          Writing
        </p>
        <h1 className="max-w-[18ch] bg-[linear-gradient(180deg,#ffffff_28%,#a6a9ae)] bg-clip-text font-display text-[clamp(34px,6vw,64px)] font-black uppercase leading-[0.96] tracking-[-0.02em] text-transparent">
          Notes on Cloud &amp; AI
        </h1>
        <p className="mt-6 max-w-[60ch] text-[clamp(15px,1.6vw,18px)] font-light leading-[1.7] text-[#b9bcc0]">
          Practical writing on AWS, DevOps, and building with AI — lessons from shipping and
          operating real production systems.
        </p>
      </header>

      {/* grid */}
      <div className="mt-12 grid grid-cols-3 gap-5 max-[860px]:grid-cols-1 max-[860px]:mt-10">
        {BLOGS.map((b) => (
          <BlogCard key={b.slug} blog={b} />
        ))}
      </div>
    </main>
  );
}
