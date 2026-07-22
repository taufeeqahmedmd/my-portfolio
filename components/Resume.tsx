import type { ReactNode } from "react";
import Link from "next/link";
import ProjectShowcase from "@/components/ProjectShowcase";
import BlogCard from "@/components/BlogCard";
import { BLOGS } from "@/lib/blogs";

/* ---- shared design tokens (match the hero poster) ---- */
const card =
  "rounded-[22px] border border-white/[0.07] bg-[rgba(16,17,18,0.62)] p-[26px] backdrop-blur-[14px] shadow-[0_24px_60px_rgba(0,0,0,0.45)]";
const heading = "font-display text-[19px] font-extrabold tracking-[0.04em]";

/* ---- content ---- */
const SUMMARY =
  "Cloud and DevOps Engineer with around 4 years of IT experience — approximately 2 years deploying and operating applications on AWS cloud infrastructure and 2 years in full-stack development. Experienced in running production workloads on AWS EC2 with Linux, Nginx, CI/CD pipelines, and IAM-based access control, with a strong full-stack background in React, Next.js, and Node.js. Currently pursuing the AWS Certified Solutions Architect – Associate certification, focused on secure, scalable, and highly available cloud solutions.";

type Skill = { name: string; logo?: string };
const s = (name: string, logo?: string): Skill => ({ name, logo: logo ? `/logos/tech/${logo}` : undefined });

const SKILL_GROUPS: { label: string; items: Skill[] }[] = [
  {
    label: "Cloud Platforms (AWS)",
    items: [
      s("EC2", "ec2.svg"), s("IAM", "iam.svg"), s("VPC", "vpc.svg"), s("S3", "s3.svg"),
      s("Route 53", "route53.svg"), s("CloudWatch", "cloudwatch.svg"), s("CloudTrail", "cloudtrail.svg"),
      s("RDS", "rds.svg"), s("Load Balancer", "elb.svg"), s("Auto Scaling"), s("ECR"),
      s("ECS", "ecs.svg"), s("Lightsail", "lightsail.svg"),
    ],
  },
  {
    label: "DevOps & CI/CD",
    items: [s("Docker", "docker.svg"), s("GitHub Actions", "githubactions.svg"), s("CI/CD"), s("Git", "git.svg"), s("Linux", "linux.svg"), s("Nginx", "nginx.svg")],
  },
  {
    label: "Monitoring",
    items: [s("CloudWatch", "cloudwatch.svg"), s("Grafana", "grafana.svg"), s("Logging"), s("Alerting")],
  },
  {
    label: "Development",
    items: [s("React", "react.svg"), s("Next.js", "nextjs.svg"), s("Node.js", "nodejs.svg"), s("JavaScript (ES6+)", "javascript.svg"), s("TypeScript", "typescript.svg"), s("Java", "java.svg"), s("Python", "python.svg")],
  },
  {
    label: "Databases",
    items: [s("PostgreSQL", "postgresql.svg"), s("MySQL", "mysql.svg"), s("Firebase", "firebase.svg"), s("DynamoDB", "dynamodb.svg")],
  },
  {
    label: "OS & Version Control",
    items: [s("Linux", "linux.svg"), s("Ubuntu", "ubuntu.svg"), s("Bash", "bash.svg"), s("Git", "git.svg"), s("GitHub", "github.svg")],
  },
];

const EXPERIENCE: { role: string; company: string; period: string; points: string[] }[] = [
  {
    role: "Cloud Engineer",
    company: "K-Innovative Hub Pvt. Ltd. — Hyderabad, India",
    period: "2024 — Present",
    points: [
      "Deployed and managed production web and ERP applications on AWS EC2 (Linux), handling instance provisioning, server configuration, and ongoing maintenance.",
      "Configured Nginx as a reverse proxy and managed domains, DNS (Route 53), and SSL/TLS certificates for secure HTTPS access.",
      "Built and maintained CI/CD release workflows with Git and GitHub to automate and standardize application deployments.",
      "Managed IAM users, roles, and access policies and monitored application health, logs, and metrics through CloudWatch.",
    ],
  },
  {
    role: "Full-Stack Developer",
    company: "K-Innovative Hub Pvt. Ltd.",
    period: "2022 — 2024",
    points: [
      "Developed responsive, user-centric frontends for ERP, school/college, and B2B web applications using React.js and Next.js (TypeScript, ES6+).",
      "Built and consumed RESTful APIs and integrated SQL and NoSQL databases (MySQL, Firebase) to deliver dynamic, data-driven features.",
      "Worked in Agile/Scrum teams with Git version control and code reviews, and implemented unit and API testing (Jest, JUnit, Postman) for reliability.",
    ],
  },
];

/* Project data (with slugs + detail content) lives in lib/projects.ts */

const CERTS: { name: string; issuer: string; status?: string; logo?: string; mono?: string }[] = [
  { name: "AWS Certified Solutions Architect – Associate (SAA-C03)", issuer: "Amazon Web Services", status: "Pursuing", logo: "/logos/aws.svg" },
  { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", logo: "/logos/aws.svg" },
  { name: "Advanced Certification in GenAI & Multi-Agent Systems", issuer: "Coding Ninjas", status: "Pursuing", logo: "/logos/codingninjas.svg" },
  { name: "Python Programming (PCAP)", issuer: "Cisco · Python Institute", logo: "/logos/python.svg" },
  { name: "Prompt Engineering & GenAI Tools", issuer: "Google", logo: "/logos/google.svg" },
  { name: "Automation Testing", issuer: "QSpiders", mono: "Q" },
  { name: "React JS", issuer: "Udemy", logo: "/logos/react.svg" },
  { name: "Java Business Application Development", issuer: "Oracle Java", logo: "/logos/java.svg" },
];

/* ---- small building blocks ---- */
function Section({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <div className="mt-[70px] max-[860px]:mt-12">
      <div data-reveal className="reveal mb-7 flex items-center gap-4">
        <span className="font-display text-[13px] font-black tracking-[0.25em] text-accent">{n}</span>
        <h2 className="font-display text-[clamp(20px,2.6vw,30px)] font-black uppercase tracking-[0.02em] text-ink">{title}</h2>
        <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
      </div>
      {children}
    </div>
  );
}

function Pill({ name, logo }: Skill) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.04] py-1.5 text-[12px] font-medium text-[#d8dadd] transition-colors hover:border-white/20 hover:bg-white/[0.07] ${logo ? "pl-2 pr-3" : "px-3"}`}
    >
      {logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt="" aria-hidden className="h-[15px] w-[15px] flex-shrink-0 object-contain" />
      )}
      {name}
    </span>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <p className="font-display text-[30px] font-black leading-none text-accent">{n}</p>
      <p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-faint">{label}</p>
    </div>
  );
}

/* ---- icons ---- */
const CapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 8.5 12 4l10 4.5-10 4.5L2 8.5Z" />
    <path d="M6 10.6V15c0 1.3 2.7 2.6 6 2.6s6-1.3 6-2.6v-4.4" />
    <path d="M22 8.5v5" />
  </svg>
);

/* ================= PAGE 2 ================= */
export default function Resume() {
  return (
    <section id="resume" className="relative z-[3] mx-auto max-w-[1180px] px-9 pb-24 pt-4 max-[860px]:px-5 max-[860px]:pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
      {/* --- opener: mirrors the hero's "big title left / detail right" rhythm --- */}
      <div data-reveal className="reveal border-t border-white/[0.08] pt-14 max-[860px]:pt-10">
        <div className="grid grid-cols-[1fr_1.15fr] items-start gap-12 max-[860px]:grid-cols-1 max-[860px]:gap-7">
          <div>
            <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.34em] text-accent">Full Résumé</p>
            <h2 className="font-display text-[clamp(34px,5.4vw,68px)] font-black uppercase leading-[0.9] tracking-[-0.01em] text-[#c9cbce]">
              Cloud <span className="text-accent">&amp;</span>
              <br />
              DevOps
              <br />
              Engineer
            </h2>
            <div className="mt-7 flex gap-9">
              <Stat n="4+" label="Years in IT" />
              <Stat n="2+" label="Years on AWS" />
              <Stat n="8+" label="Projects" />
            </div>
          </div>
          <div className="pt-1.5">
            <h3 className={`${heading} mb-3`}>
              PROFESSIONAL <span className="text-accent">SUMMARY</span>
            </h3>
            <p className="text-[14.5px] leading-[1.72] text-muted">{SUMMARY}</p>
          </div>
        </div>
      </div>

      {/* --- 01 CORE SKILLS (spec-sheet layout) --- */}
      <Section n="01" title="Core Skills">
        <div data-reveal className={`reveal ${card}`}>
          {SKILL_GROUPS.map((g) => (
            <div
              key={g.label}
              className="grid grid-cols-[195px_1fr] gap-6 border-b border-white/[0.06] py-4 first:pt-0 last:border-0 last:pb-0 max-[640px]:grid-cols-1 max-[640px]:gap-2.5"
            >
              <p className="pt-1 font-display text-[12.5px] font-bold uppercase tracking-[0.05em] text-accent">{g.label}</p>
              <div className="flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <Pill key={it.name} {...it} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* --- 02 EXPERIENCE (timeline) --- */}
      <Section n="02" title="Experience">
        <div data-reveal className="reveal relative pl-9 max-[640px]:pl-7">
          <span className="absolute left-[6px] bottom-2 top-2 w-px bg-gradient-to-b from-accent/50 via-white/12 to-transparent" />
          <div className="flex flex-col gap-8">
            {EXPERIENCE.map((e) => (
              <div key={e.role} className="relative">
                <span className="absolute -left-9 top-1 h-3.5 w-3.5 rounded-full border-2 border-accent bg-[#111] shadow-[0_0_12px_rgba(148,242,60,0.5)] max-[640px]:-left-7" />
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-[16px] font-extrabold uppercase tracking-[0.03em] text-accent">{e.role}</h3>
                  <span className="text-[12px] font-semibold text-faint">{e.period}</span>
                </div>
                <p className="mt-0.5 text-[13.5px] font-semibold text-ink">{e.company}</p>
                <ul className="mt-2.5 flex flex-col gap-1.5">
                  {e.points.map((p, i) => (
                    <li
                      key={i}
                      className="relative pl-4 text-[13px] leading-[1.6] text-muted before:absolute before:left-0 before:top-px before:text-accent before:content-['▹']"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* --- 03 PROJECTS --- */}
      <Section n="03" title="Projects">
        <ProjectShowcase />
      </Section>

      {/* --- 04 CERTIFICATIONS --- */}
      <Section n="04" title="Certifications">
        <p className="-mt-2 mb-6 text-[12.5px] text-faint">
          <span className="font-semibold text-muted">{CERTS.length} certifications</span>
          {" · "}
          {CERTS.filter((c) => c.status).length} currently in progress
        </p>
        <div data-reveal className="reveal grid grid-cols-2 gap-4 max-[860px]:grid-cols-1">
          {CERTS.map((c) => (
            <div
              key={c.name}
              className="group relative flex items-center gap-4 overflow-hidden rounded-[18px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.01))] p-4 shadow-[0_16px_38px_-24px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_22px_46px_-20px_rgba(0,0,0,0.78),0_0_22px_rgba(148,242,60,0.1)]"
            >
              {/* hover accent glow */}
              <span
                aria-hidden
                className="pointer-events-none absolute -left-8 -top-10 h-24 w-24 rounded-full bg-accent/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
              />

              {/* logo tile */}
              <span className="relative grid h-[46px] w-[46px] flex-shrink-0 place-items-center rounded-[13px] border border-white/10 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 group-hover:border-accent/40">
                {c.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.logo} alt={`${c.issuer || c.name} logo`} className="h-6 w-6 object-contain" />
                ) : (
                  <span className="font-display text-[16px] font-black text-accent">{c.mono}</span>
                )}
              </span>

              {/* text */}
              <div className="relative min-w-0 flex-1">
                <p className="text-[13.5px] font-bold leading-snug text-ink">{c.name}</p>
                {c.issuer && <p className="mt-1 text-[11.5px] tracking-[0.02em] text-faint">{c.issuer}</p>}
              </div>

              {/* status */}
              {c.status ? (
                <span className="relative flex-shrink-0 rounded-full border border-accent/35 bg-accent/10 px-2.5 py-[3px] text-[9px] font-bold uppercase tracking-[0.12em] text-accent shadow-[0_0_14px_rgba(148,242,60,0.12)]">
                  {c.status}
                </span>
              ) : (
                <span
                  title="Completed"
                  className="relative flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent/[0.08] text-accent"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* --- 05 EDUCATION --- */}
      <Section n="05" title="Education">
        <div data-reveal className={`reveal ${card} flex items-center justify-between gap-6 max-[640px]:flex-col max-[640px]:items-start`}>
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-accent">
              <CapIcon />
            </span>
            <div>
              <h3 className="text-[16px] font-bold text-ink">B.Tech, Computer Science Engineering</h3>
              <p className="mt-1 text-[13.5px] text-muted">Anurag College of Engineering (Affiliated to Jawaharlal Nehru Technological University, Hyderabad), India</p>
            </div>
          </div>
          <span className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[12px] font-semibold text-faint">
            2017 — 2021
          </span>
        </div>
      </Section>

      {/* --- 06 WRITING --- */}
      <Section n="06" title="Writing">
        <div data-reveal className="reveal grid grid-cols-3 gap-5 max-[860px]:grid-cols-1">
          {BLOGS.slice(0, 3).map((b) => (
            <BlogCard key={b.slug} blog={b} />
          ))}
        </div>
        <div className="mt-7 flex justify-center">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] text-muted no-underline transition-all duration-200 hover:border-accent/45 hover:text-accent"
          >
            See all articles
            <svg width="18" height="11" viewBox="0 0 40 16" fill="none" className="transition-transform duration-200 group-hover:translate-x-1">
              <path d="M2 8h34m0 0-6-5m6 5-6 5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </Section>

      {/* --- footer --- */}
      <footer
        data-reveal
        className="reveal mt-10 flex flex-col items-center border-t border-white/[0.08] pt-5 text-center text-[12.5px] text-faint"
      >
        <p>© 2026 Mohammed Taufeeq Ahmed</p>
      </footer>
    </section>
  );
}
