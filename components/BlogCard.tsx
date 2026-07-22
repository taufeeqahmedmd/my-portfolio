import Link from "next/link";
import { fmtDate, type Blog } from "@/lib/blogs";

export default function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[20px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.012))] p-[22px] no-underline shadow-[0_18px_44px_-24px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[14px] transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/45 hover:shadow-[0_26px_56px_-22px_rgba(0,0,0,0.78),0_0_26px_rgba(148,242,60,0.13)]"
    >
      {/* top accent hairline — draws in on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[linear-gradient(90deg,rgba(148,242,60,0.7),rgba(148,242,60,0.25),transparent)] transition-transform duration-500 ease-out group-hover:scale-x-100"
      />

      {/* hover accent glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-16 h-32 w-32 rounded-full bg-accent/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* meta row: category chip + read time */}
      <div className="relative mb-3.5 flex items-center gap-2.5">
        <span className="inline-flex items-center rounded-full border border-accent/25 bg-accent/[0.07] px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
          {blog.category}
        </span>
        <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-faint">
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5v4.7l3 1.8" />
          </svg>
          {blog.readMins} min read
        </span>
      </div>

      <h3 className="relative font-display text-[16px] font-extrabold leading-[1.28] tracking-[0.01em] text-ink transition-colors duration-300 group-hover:text-white">
        {blog.title}
      </h3>

      <p className="relative mt-2.5 flex-1 text-[12.5px] leading-[1.6] text-muted line-clamp-3">
        {blog.excerpt}
      </p>

      {/* tag chips */}
      {blog.tags.length > 0 && (
        <div className="relative mt-4 flex flex-wrap gap-1.5">
          {blog.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-[3px] text-[10px] font-semibold tracking-[0.02em] text-faint transition-colors duration-300 group-hover:border-white/[0.12] group-hover:text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="relative mt-5 flex items-center justify-between border-t border-white/[0.06] pt-3.5">
        <span className="text-[11px] text-faint">{fmtDate(blog.date)}</span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-faint transition-colors group-hover:text-accent">
          Read
          <svg
            width="18"
            height="11"
            viewBox="0 0 40 16"
            fill="none"
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            <path d="M2 8h34m0 0-6-5m6 5-6 5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
