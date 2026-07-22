import Portrait from "@/components/Portrait";
import RevealInit from "@/components/RevealInit";
import Resume from "@/components/Resume";
import TechMarquee from "@/components/TechMarquee";
import NavCard from "@/components/NavCard";
import GithubActivity from "@/components/GithubActivity";
import Dock from "@/components/Dock";

const card =
  "rounded-[22px] border border-white/[0.07] bg-[rgba(16,17,18,0.62)] p-[26px] backdrop-blur-[14px] shadow-[0_24px_60px_rgba(0,0,0,0.45)]";
const heading = "font-display text-[19px] font-extrabold tracking-[0.04em]";

const SKILLS = [
  "Cloud Architecture (AWS)",
  "Infrastructure as Code",
  "CI/CD Pipelines",
  "Containerization (Docker)",
  "Linux Administration",
  "Networking, DNS & SSL",
  "Monitoring & Alerting",
  "Security & IAM",
  "Full-Stack Development",
  "Databases (SQL / NoSQL)",
  "Automation & Scripting",
  "Agile / Scrum",
];

const TECH = [
  "AWS","EC2","IAM","VPC","S3","Route 53","RDS","ECS","Docker","Nginx",
  "Linux","CI/CD","GitHub Actions","CloudWatch","Grafana","React","Next.js",
  "Node.js","TypeScript","Python","PostgreSQL",
];

export default function Home() {
  return (
    <>
    <main className="relative mx-auto max-w-[1180px] overflow-hidden px-9 pb-14 pt-12 max-[860px]:px-5 max-[860px]:pb-10 max-[860px]:pt-8">
      <RevealInit />

      {/* Large rotating role ring BEHIND the portrait */}
      <div className="absolute left-1/2 top-[280px] z-[1] aspect-square w-[clamp(300px,34vw,430px)] -translate-x-1/2 max-[860px]:hidden">
        <svg viewBox="0 0 400 400" className="role-ring">
          <defs>
            <path id="bigCircle" d="M200,200 m-168,0 a168,168 0 1,1 336,0 a168,168 0 1,1 -336,0" />
          </defs>
          <text className="ring-text-lg">
            <textPath href="#bigCircle" startOffset="0%">
              CLOUD ENGINEER · DEVOPS ENGINEER · SOLUTIONS ARCHITECT · CLOUD ENGINEER · DEVOPS ENGINEER · SOLUTIONS ARCHITECT ·&nbsp;
            </textPath>
          </text>
        </svg>
      </div>

      {/* Green signature arrow near the head */}
      <div className="absolute left-[55%] top-[150px] z-[4] max-[860px]:hidden">
        <svg
          width="70"
          height="70"
          viewBox="0 0 64 64"
          fill="none"
          stroke="#94f23c"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="-rotate-[240deg] drop-shadow-[0_0_12px_rgba(148,242,60,0.45)]"
        >
          <path d="M8 24 Q14 47 22 42 Q26 39 30 13 Q32 5 36 16 L46 43" />
          <path d="M46 43 L37 41" />
          <path d="M46 43 L46 31" />
        </svg>
      </div>

      {/* ===== TOP ROW: giant name (left) + education (right) ===== */}
      <div className="relative z-[3] grid grid-cols-[1.55fr_1fr] items-start gap-8 max-[860px]:grid-cols-1 max-[860px]:gap-6">
        <header data-reveal className="reveal">
          <h1 className="font-display text-[clamp(40px,7.6vw,104px)] font-black uppercase leading-[0.86] tracking-[-0.02em] text-[#979aa0]">
            Mohammed
            <br />
            Taufeeq
            <br />
            Ahmed
          </h1>
          <p className="mt-4 text-[clamp(12px,1.4vw,15px)] font-bold uppercase tracking-[0.34em] text-[#83858a]">
            Cloud Engineer
          </p>
        </header>

        <section data-reveal className="reveal pt-[60px] text-left max-[860px]:pt-0">
          <h2 className={`${heading} mb-3`}>EDUCATION</h2>
          <p className="text-[15px] font-semibold leading-snug">
            B.Tech, Computer Science Engineering
          </p>
          <p className="mt-1.5 text-[13.5px] leading-[1.5] text-muted">
            Anurag College of Engineering (Anurag University), India
          </p>
          <p className="mt-1.5 text-[12px] text-faint">2017 – 2021</p>
        </section>
      </div>

      {/* Center portrait — absolute (behind content) on desktop; on mobile it
          drops into normal flow right under the name/role as a hero visual. */}
      <Portrait />

      {/* ===== MAIN GRID ===== */}
      <div className="relative z-[3] mt-12 grid grid-cols-2 gap-10 max-[860px]:mt-8 max-[860px]:grid-cols-1 max-[860px]:gap-[30px]">
        {/* ---------- LEFT COLUMN ----------
            On mobile the column wrappers become `display:contents`, so all six
            sections collapse into the single-column grid and are re-sequenced
            with `order-*` into a deliberate reading order. Desktop is untouched. */}
        <div className="flex flex-col gap-[26px] max-[860px]:contents">
          <section data-reveal className={`reveal ${card} max-[860px]:order-1`}>
            <h2 className={`${heading} mb-4`}>
              ENGINEER <span className="text-accent">DNA</span>
            </h2>
            <ul className="mb-4 flex flex-col gap-[7px]">
              <li className="text-[15px] text-muted">
                <strong className="mr-1 text-[19px] font-extrabold text-accent">4+</strong>
                Years in IT.
              </li>
              <li className="text-[15px] text-muted">
                <strong className="mr-1 text-[19px] font-extrabold text-accent">2+</strong>
                Years on AWS.
              </li>
              <li className="text-[15px] text-muted">
                <strong className="mr-1 text-[19px] font-extrabold text-accent">One</strong>
                reliability-obsessed mind.
              </li>
            </ul>
            <p className="text-[13.5px] leading-[1.62] text-muted">
              Cloud &amp; DevOps engineer running production workloads on AWS — EC2,
              Linux, Nginx, CI/CD and IAM-based access control — with a deep
              full-stack background in React, Next.js and Node.js. Currently
              pursuing the AWS Solutions Architect – Associate, focused on secure,
              scalable, highly available systems.
            </p>
          </section>

          {/* GitHub */}
          <section data-reveal className="reveal px-1 max-[860px]:order-5">
            <a
              href="https://github.com/taufeeqahmedmd"
              target="_blank"
              rel="noopener"
              className="group flex items-center gap-4 text-ink no-underline"
            >
              <span className="flex h-16 w-16 flex-shrink-0 place-items-center justify-center rounded-2xl bg-[#111] text-white transition-transform duration-200 group-hover:-translate-y-1">
                <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor">
                  <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.74 1.27 3.41.97.1-.76.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.42.37.79 1.09.79 2.2v3.26c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
                </svg>
              </span>
              <span>
                <strong className="block font-display text-[22px] tracking-[0.02em]">
                  GITHUB
                </strong>
                <span className="text-[13px] text-muted">Explore my world.</span>
              </span>
              <span className="ml-0.5 text-accent transition-transform duration-200 group-hover:-translate-x-1">
                <svg viewBox="0 0 60 24" width="60" height="24">
                  <path
                    d="M58 12H6m0 0 8-7m-8 7 8 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
            <p className="mt-2.5 text-[12px] text-faint underline underline-offset-[3px]">
              github.com/taufeeqahmedmd
            </p>
          </section>

          {/* Tech arsenal */}
          <section data-reveal className={`reveal ${card} max-[860px]:order-4`}>
            <h2 className={`${heading} mb-4`}>
              <span className="text-accent">TECH</span> ARSENAL
            </h2>
            <TechMarquee rows={[TECH.slice(0, 11), TECH.slice(11)]} />
          </section>

          {/* GitHub contributions heatmap (live) */}
          <div className="max-[860px]:order-6">
            <GithubActivity />
          </div>
        </div>

        {/* ---------- RIGHT COLUMN ---------- */}
        <div className="flex flex-col gap-[26px] max-[860px]:contents">
          {/* Skills list */}
          <section data-reveal className="reveal text-right max-[860px]:order-2 max-[860px]:text-left">
            <h2 className={`${heading} mb-3`}>SKILLS</h2>
            <ul className="flex flex-col gap-[5px]">
              {SKILLS.map((s) => (
                <li key={s} className="text-[13.5px] text-muted">
                  {s}
                </li>
              ))}
            </ul>
          </section>

          {/* Career journey */}
          <section data-reveal className={`reveal ${card} max-[860px]:order-3`}>
            <h2 className={`${heading} mb-4`}>
              CAREER <span className="text-accent">JOURNEY</span>
            </h2>

            <div className="py-3.5">
              <h3 className="font-display text-[14px] font-extrabold tracking-[0.04em] text-accent">
                CLOUD ENGINEER
              </h3>
              <p className="mt-[3px] text-[14px] font-semibold">
                K-Innovative Hub Pvt. Ltd. — Hyderabad, India
              </p>
              <p className="mt-0.5 text-[11.5px] text-faint">
                2024 – Present (Full-Time)
              </p>
              <p className="mt-[7px] text-[12.5px] leading-[1.55] text-muted">
                Deployed &amp; managed production web/ERP apps on AWS EC2. Nginx
                reverse proxy, Route 53 DNS, SSL/TLS, GitHub CI/CD, IAM &amp;
                CloudWatch monitoring.
              </p>
            </div>

            <div className="border-t border-white/[0.06] py-3.5">
              <h3 className="font-display text-[14px] font-extrabold tracking-[0.04em]">
                FULL-STACK DEVELOPER
              </h3>
              <p className="mt-[3px] text-[14px] font-semibold">
                K-Innovative Hub Pvt. Ltd.
              </p>
              <p className="mt-0.5 text-[11.5px] text-faint">2022 – 2024 (Full-Time)</p>
              <p className="mt-[7px] text-[12.5px] leading-[1.55] text-muted">
                Built responsive ERP, school/college &amp; B2B frontends in
                React/Next.js. RESTful APIs, SQL/NoSQL, Agile, unit &amp; API
                testing.
              </p>
            </div>

            <div className="border-t border-white/[0.06] py-3.5">
              <h3 className="font-display text-[14px] font-extrabold tracking-[0.04em]">
                KEY PROJECT
              </h3>
              <p className="mt-[3px] text-[14px] font-semibold">
                Production ERP Deployment on AWS
              </p>
              <p className="mt-0.5 text-[11.5px] text-faint">
                EC2 · Linux · Nginx · CI/CD · SSL/DNS
              </p>
              <p className="mt-[7px] text-[12.5px] leading-[1.55] text-muted">
                Next.js ERP serving enterprise users — repeatable, secure
                production releases.
              </p>
            </div>

            <div className="border-t border-white/[0.06] py-3.5">
              <h3 className="font-display text-[14px] font-extrabold tracking-[0.04em]">
                CERTIFICATIONS
              </h3>
              <ul className="mt-[7px] flex flex-col gap-[5px]">
                {[
                  <>AWS Solutions Architect – Associate <em className="not-italic text-faint">(Pursuing)</em></>,
                  <>AWS Certified Cloud Practitioner</>,
                  <>Python (Cisco PCAP) · Prompt Engineering &amp; GenAI (Google)</>,
                ].map((item, i) => (
                  <li
                    key={i}
                    className="relative pl-3.5 text-[12.5px] text-muted before:absolute before:left-0 before:text-accent before:content-['›']"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>

      {/* Live route card — appears above the résumé cue only if location is allowed */}
      <div className="relative z-[3] mx-auto mt-14 max-w-[620px] max-[860px]:mt-10">
        <NavCard />
      </div>

      {/* Scroll cue → page 2 */}
      <a
        href="#resume"
        data-reveal
        className="reveal mt-16 flex flex-col items-center gap-2 text-faint no-underline transition-colors hover:text-accent max-[860px]:mt-12"
      >
        <span className="text-[10.5px] font-bold uppercase tracking-[0.3em]">Résumé below</span>
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-bounce text-accent"
        >
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </a>
    </main>

    <Resume />
    <Dock />
    </>
  );
}
