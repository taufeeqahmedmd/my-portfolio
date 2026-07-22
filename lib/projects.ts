export type Project = {
  slug: string;
  title: string;
  category: "Key Project" | "Personal Project";
  tag?: string;
  /** short line used on the résumé card */
  summary: string;
  /** longer intro used on the detail page */
  overview: string;
  highlights: string[];
  tech: string[];
  /** hosting / infrastructure the app is deployed on (shown as its own group) */
  infra?: string[];
  role?: string;
  timeframe?: string;
  /** optional "at a glance" spec sheet, rendered as label/value rows */
  stack?: { label: string; value: string }[];
  /** optional grouped detail sections; when present, replaces the single Highlights list */
  sections?: { title: string; items: string[] }[];
};

/* Shared hosting/infrastructure — every deployed web app runs on AWS EC2 (Linux),
   ships through Git/GitHub CI/CD, and is fronted by Cloudflare for DNS + SSL. */
const AWS_INFRA: string[] = ["AWS EC2", "Linux", "Git", "GitHub", "CI/CD", "SSL/DNS", "Cloudflare"];

const GROUP_A: Project[] = [
  {
    slug: "production-erp-deployment",
    title: "Production ERP Application Deployment",
    category: "Key Project",
    role: "Cloud Engineer",
    timeframe: "2024 — Present",
    tech: ["Next.js", "Nginx", "IAM", "CloudWatch"],
    infra: AWS_INFRA,
    summary:
      "Deployed and maintained a Next.js-based ERP application on AWS EC2 (Linux) serving enterprise users, with a secure, repeatable release process.",
    overview:
      "A production deployment of a Next.js enterprise ERP system on AWS. I owned the full server lifecycle — provisioning, configuration, security, and release automation — to deliver a secure, reliable, and repeatable production environment for enterprise users.",
    highlights: [
      "Provisioned and hardened AWS EC2 (Linux) instances for the ERP workload, handling server configuration and ongoing maintenance.",
      "Configured Nginx as a reverse proxy with SSL/TLS certificates for secure HTTPS access.",
      "Managed domains and DNS records through Route 53 for reliable routing.",
      "Built GitHub-based CI/CD workflows for automated, standardized, and repeatable production releases.",
      "Set up IAM users, roles, and access policies, and monitored application health and logs through CloudWatch.",
    ],
  },
  {
    slug: "work-report-application",
    title: "Work Report Application",
    category: "Key Project",
    role: "Full-Stack & DevOps",
    tech: ["Next.js", "React", "PostgreSQL", "Drizzle ORM", "Docker", "Nginx", "JWT (jose)"],
    infra: AWS_INFRA,
    summary:
      "Multi-tenant SaaS for daily work reporting — Next.js 16 + PostgreSQL, with real-time notifications, automated digests, and a full Docker/Nginx production stack.",
    overview:
      "A production multi-tenant SaaS where teams submit daily work reports and managers track who is missing them. It is a single Next.js 16 standalone application backed by PostgreSQL, with tenant isolation enforced at the database layer through Row-Level Security. It ships with live SSE notifications, automated email / WhatsApp / in-app digests, and a hardened Docker + Nginx deployment covering health checks, backups, and disaster recovery.",
    highlights: [],
    stack: [
      { label: "Type", value: "Multi-tenant SaaS · daily work reporting" },
      { label: "Application", value: "Next.js 16 standalone (App Router) · React 19 — UI + API in one process" },
      { label: "Datastore", value: "PostgreSQL 14+ (single primary) — the single source of truth" },
      { label: "ORM", value: "Drizzle ORM · self-managing boot migrations" },
      { label: "Multi-tenancy", value: "Postgres Row-Level Security (RLS), scoped per organization" },
      { label: "Sessions", value: "Stateless JWT (jose) in HttpOnly cookies, re-validated each request" },
      { label: "Real-time", value: "Server-Sent Events (SSE) for live notifications" },
      { label: "Packaging", value: "Docker (two-stage Node 20 Alpine standalone) behind Nginx" },
    ],
    sections: [
      {
        title: "Key Features",
        items: [
          "Daily work-report submission with self-service, per-organization signup.",
          "Manager digests of team members missing today's report — in-app, email, and WhatsApp.",
          "Configurable per-employee thank-you / reminder emails on a schedule.",
          "Live in-app notifications delivered over Server-Sent Events (SSE).",
          "Google OAuth sign-in with role-based access (Super Admin, managers, employees).",
          "Installable PWA with Web Push (VAPID); GDPR data export and account deletion.",
        ],
      },
      {
        title: "Architecture & Data",
        items: [
          "A single Next.js standalone app serves both the UI and the API routes.",
          "PostgreSQL as the single source of truth; the schema self-manages via lazy boot migrations.",
          "Tenant isolation enforced in-database with Row-Level Security per organization.",
          "Async submission queue — in-memory on one instance, Postgres-backed when scaled out.",
          "Boot-time sequence self-heal prevents primary-key collisions after a restore.",
        ],
      },
      {
        title: "Operations & DevOps",
        items: [
          "Dockerized single-instance and load-balanced two-instance topologies.",
          "Nginx reverse proxy for TLS, SSE pass-through, static caching, and rate limiting.",
          "Low-downtime rolling deploys — the new image builds while the old one keeps serving.",
          "Health endpoint with DB-connectivity checks, plus Docker container health checks.",
          "Automated nightly pg_dump backups with 30-day rotation and a documented restore / DR runbook.",
          "Idempotent, secret-protected cron endpoints for scheduled digests and reminders.",
        ],
      },
      {
        title: "Security & Compliance",
        items: [
          "bcrypt-hashed passwords; JWT sessions re-checked against the database on every request.",
          "Layered rate limiting (per-IP and per-employee), shared across instances when scaled.",
          "Security headers (HSTS, X-Frame-Options, Permissions-Policy) at both app and proxy.",
          "Encrypted third-party secrets at rest, password-masked logging, and an audit log of privileged actions.",
        ],
      },
    ],
  },
  {
    slug: "generative-ai-integration",
    title: "Generative AI Integration",
    category: "Personal Project",
    tag: "In Progress",
    role: "Full-Stack & AI Integration",
    timeframe: "2025 — Present",
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "pgvector",
      "Hugging Face",
      "Transformers",
      "LangChain",
      "Docker",
    ],
    summary:
      "A Generative AI learning track applied to a real build — an HR Portal with an integrated ATS that parses résumés, understands job descriptions, and semantically matches and ranks candidates using open-source Hugging Face models.",
    overview:
      "Generative AI Integration is a hands-on track where I'm learning modern GenAI — from prompt engineering and API integration through NLP, Retrieval-Augmented Generation, AI agents, and fine-tuning — and applying each skill to a single capstone product: an HR Portal with an integrated Applicant Tracking System (ATS). The portal uses open-source models from Hugging Face to parse résumés, understand job descriptions, and semantically match and rank candidates, with an LLM assisting on screening summaries and structured feedback. It is an active, in-progress build — the learning modules and the application advance together.",
    highlights: [],
    stack: [
      { label: "Type", value: "Applied GenAI capstone · HR Portal with an integrated ATS" },
      { label: "Frontend", value: "Next.js · React · TypeScript · Tailwind CSS" },
      { label: "Backend", value: "Node.js API for portal / ATS logic · Python (FastAPI) inference service" },
      { label: "Datastore", value: "PostgreSQL + pgvector for embeddings and semantic search" },
      { label: "AI models", value: "Open-source LLM & embedding models from Hugging Face (Transformers)" },
      { label: "Techniques", value: "Prompt engineering · RAG · embeddings-based matching · AI agents" },
      { label: "Packaging", value: "Dockerized services for consistent local and deploy environments" },
      { label: "Status", value: "In progress — learning track and build advancing together" },
    ],
    sections: [
      {
        title: "Learning Track",
        items: [
          "Prompt Engineering & API Integration — reliable prompting and wiring model APIs into an application.",
          "Basics of NLP & Retrieval-Augmented Generation (RAG) — grounding model output in your own documents.",
          "AI Agents & Multi-Agent Systems — orchestrating tools and multi-step reasoning.",
          "Deployment & Project Integration — shipping GenAI features into a real product.",
          "Foundations of Neural Networks & Transformers — the architecture underneath modern LLMs (add-on).",
          "Fine-Tuning LLMs — adapting open models to domain-specific tasks (optional add-on).",
        ],
      },
      {
        title: "The Application — HR Portal + ATS",
        items: [
          "A hiring platform where recruiters post roles and manage candidates end to end.",
          "An integrated ATS that ingests résumés, extracts structured data, and tracks applicants through pipeline stages.",
          "Open-source Hugging Face models power résumé parsing, job-description understanding, and candidate matching.",
          "LLM-generated screening summaries and match explanations to speed up shortlisting.",
        ],
      },
      {
        title: "How Generative AI Fits In",
        items: [
          "Résumé & JD parsing — models extract skills, experience, and requirements into structured fields.",
          "Semantic matching — candidate and job embeddings are compared with vector search (pgvector) to rank fit beyond keyword overlap.",
          "Retrieval-Augmented Generation — summaries and answers are grounded in the actual résumé / JD content to reduce hallucination.",
          "Agents — multi-step flows (screen → summarize → score → suggest next action) coordinated as an agent pipeline.",
        ],
      },
      {
        title: "Architecture & Tech",
        items: [
          "Frontend — Next.js + React + TypeScript styled with Tailwind CSS.",
          "Backend — a Node.js API for portal and ATS logic, with a Python (FastAPI) service dedicated to model inference.",
          "Data — PostgreSQL as the system of record, extended with pgvector for embeddings and semantic search.",
          "AI — open-source LLM and embedding models from Hugging Face (Transformers), orchestrated with LangChain, using prompt engineering and RAG for grounded outputs.",
          "Packaging — Dockerized services keep local development and deployment environments consistent.",
        ],
      },
      {
        title: "Status & Roadmap",
        items: [
          "Actively in development — built hand in hand with the Generative AI learning track.",
          "Current focus — résumé parsing, embeddings-based matching, and the core ATS workflow.",
          "Planned — agentic screening flows and optional fine-tuning of open models for domain-specific accuracy.",
        ],
      },
    ],
  },
];

const GROUP_B: Project[] = [
  {
    slug: "ai-agent-hub",
    title: "AI Agent Hub",
    category: "Personal Project",
    tag: "Prototype",
    role: "Full-Stack",
    tech: ["React", "Tailwind CSS", "Node.js", "PostgreSQL", "Razorpay"],
    summary:
      "A prototype model hub in the spirit of Hugging Face — browse a catalog of AI models, sign in to download, with free models one click away and paid models unlocked through Razorpay checkout.",
    overview:
      "AI Agent Hub is a prototype for a Hugging Face–style model hub: a single place to browse and download AI models of many kinds. It was built to prove the core flow end to end — an open catalog anyone can explore, authentication that gates downloads, and a free-versus-paid access model with Razorpay handling checkout for paid models. The front end is a React + Tailwind single-page app talking to a Node.js API backed by PostgreSQL.",
    highlights: [],
    stack: [
      { label: "Type", value: "Prototype · Hugging Face–style AI model hub" },
      { label: "Frontend", value: "React single-page app · Tailwind CSS" },
      { label: "Backend", value: "Node.js API" },
      { label: "Datastore", value: "PostgreSQL — users, model catalog, and orders" },
      { label: "Access model", value: "Open browsing · sign-in required to download · free vs. paid tiers" },
      { label: "Payments", value: "Razorpay checkout for paid models" },
    ],
    sections: [
      {
        title: "Key Features",
        items: [
          "A browsable catalog of AI models of many types, explorable without an account.",
          "Sign-in required only when a user chooses to download a model.",
          "Free models download directly once the user is signed in.",
          "Paid models unlock after a Razorpay checkout completes.",
        ],
      },
      {
        title: "User Flow",
        items: [
          "Explore — visitors browse the hub and open model pages freely, with no account needed.",
          "Authenticate — starting a download prompts the user to sign in.",
          "Free path — free models become available immediately after sign-in.",
          "Paid path — paid models route to Razorpay, and access is granted once the payment is confirmed.",
        ],
      },
      {
        title: "Architecture & Data",
        items: [
          "A React + Tailwind single-page front end calls a Node.js API.",
          "PostgreSQL holds users, the model catalog, and purchase / download records.",
          "Download access is decided on the server — by sign-in for free models, and by a confirmed payment for paid ones.",
        ],
      },
      {
        title: "Scope & Status",
        items: [
          "Built as a prototype to validate the catalog-plus-paywall concept end to end.",
          "Focused on the core browse → authenticate → download / pay flow rather than production hardening.",
        ],
      },
    ],
  },
  {
    slug: "smart-assistant-visually-impaired",
    title: "Smart Assistant for the Visually Impaired",
    category: "Personal Project",
    tag: "Academic",
    role: "Computer Vision",
    timeframe: "2021",
    tech: ["Python", "OpenCV", "YOLO", "NumPy", "gTTS", "Deep Learning"],
    summary:
      "\"Smart Vision\" — a real-time assistive-vision tool that detects objects from a webcam, tracks their movement across frames, and announces their name and direction aloud, giving blind and visually impaired users hands-free audio awareness of their surroundings with no special hardware.",
    overview:
      "Smart Vision is a final-year B.Tech computer-vision project that helps blind and visually impaired people move safely through unfamiliar indoor and outdoor spaces. A live webcam feed is passed through a YOLO object detector; each detected object's position is tracked across successive frames to infer whether it is moving left or right, and a text-to-speech engine announces the object's class and direction as spoken audio. Unlike traditional electronic travel aids that rely on expensive ultrasonic, RFID, or infrared hardware, the whole system runs in software on a commodity laptop with a webcam and speaker — making it cheap, portable, and simple to use.",
    highlights: [],
    stack: [
      { label: "Type", value: "Assistive computer-vision aid · real-time object detection + audio guidance" },
      { label: "Detection", value: "YOLOv2 single-shot CNN detector on the 80-class COCO dataset, run via OpenCV's DNN module" },
      { label: "Input / Output", value: "Live webcam video stream in · spoken object name + movement direction out" },
      { label: "Tracking", value: "Per-frame bounding-box coordinates compared across frames to infer left / right motion" },
      { label: "Speech", value: "Google Text-to-Speech (gTTS) with a pyttsx3 offline fallback engine" },
      { label: "Stack", value: "Python 3.6 · NumPy · OpenCV — runs on any Windows laptop with a webcam" },
    ],
    sections: [
      {
        title: "Key Features",
        items: [
          "Real-time object detection from a standard webcam feed, with no dedicated sensors required.",
          "Spoken alerts announcing each detected object and whether it is moving left or right.",
          "Runs entirely in software on a commodity laptop — cheap, portable, and user-friendly.",
          "Designed for hands-free use with minimal or no training for the end user.",
          "Works indoors and outdoors in unfamiliar environments.",
        ],
      },
      {
        title: "How It Works",
        items: [
          "Capture — a continuous video stream is read frame by frame from the webcam with OpenCV.",
          "Detect — each frame is passed through the YOLO network, producing bounding boxes, class labels, and confidence scores; non-maximum suppression filters out overlapping, low-confidence boxes.",
          "Locate — the (x, y) coordinates, width, and height of each detected object's box are derived from the detection.",
          "Track movement — an object's current x-coordinate is compared with its position in the previous frame; a shift beyond a threshold is classified as moving left or right.",
          "Speak — the object's class and inferred direction are converted to speech and played back to the user.",
        ],
      },
      {
        title: "Detection & Tracking Details",
        items: [
          "YOLO frames detection as a single regression pass over the whole image, enabling real-time speeds with low latency.",
          "The COCO-trained model recognizes 80 everyday object classes out of the box.",
          "Recently seen objects and their coordinates are retained between frames (via a Python deque) so positions can be compared to detect motion.",
          "A pixel-shift threshold suppresses jitter, so only meaningful movement triggers a voice alert.",
        ],
      },
    ],
  },
  {
    slug: "ocr-document-ai",
    title: "OCR & Document AI",
    category: "Personal Project",
    tech: ["Tesseract", "OpenCV", "Deep Learning"],
    summary:
      "An automated document-recognition pipeline using OCR and computer-vision techniques.",
    overview:
      "An automated document-recognition pipeline that extracts text and structure from documents by pairing classical OCR with computer-vision pre-processing and deep-learning techniques.",
    highlights: [
      "Text extraction with Tesseract OCR.",
      "Image pre-processing with OpenCV to boost recognition accuracy.",
      "Deep-learning techniques for document understanding.",
    ],
  },
  {
    slug: "transport-route-optimization",
    title: "Transport Route Optimization",
    category: "Key Project",
    role: "Full-Stack & DevOps",
    timeframe: "2026",
    tech: ["Next.js", "React", "TypeScript", "Node.js", "Express", "PostgreSQL", "PostGIS", "Redis", "Prisma", "Docker"],
    infra: AWS_INFRA,
    summary:
      "TransitHub — an offline-first school-transport platform built for 200,000-student scale: RFID attendance with GPS, Google-Maps route optimization (CVRP), and per-bus QR verification, with sub-500 ms offline taps and automatic background sync.",
    overview:
      "TransitHub is a production-grade, mobile-first, offline-first platform for running school transport at scale. It unifies three pillars — RFID student attendance with GPS capture on every tap, Google-Maps-driven route optimization with a CVRP solver and fuel/CO₂ analytics, and permanent per-bus QR verification with wrong-bus detection and audited overrides. The tap screen decides APPROVED / REJECTED / NOT_FOUND locally in under 500 ms with no network, queuing events in IndexedDB and flushing them idempotently in the background — so field attendance keeps working through any backend outage. It runs on a Next.js 15 PWA and a TypeScript / Express API over PostgreSQL 16 + PostGIS and Redis, targets 200,000+ students and 99.9% availability, and pins all wall-clock logic to India Standard Time.",
    highlights: [],
    stack: [
      { label: "Type", value: "Offline-first school-transport platform · RFID attendance · route optimization · QR verification" },
      { label: "Frontend", value: "Next.js 15 (App Router) · React 18 · MUI v6 — installable PWA with a Serwist service worker" },
      { label: "Backend", value: "Node.js 20 · Express 4 · TypeScript — REST API under /api/v1, Zod-validated at boot" },
      { label: "Datastore", value: "PostgreSQL 16 + PostGIS 3.4 — monthly-partitioned event tables with geography columns" },
      { label: "Offline layer", value: "Dexie (IndexedDB) roster cache + tap queue · Background Sync · idempotent on client_event_id" },
      { label: "Cache / Broker", value: "Redis 7 (AOF) — refresh tokens, live counters, rate limiting, SSE Pub/Sub, BullMQ queues" },
      { label: "Background work", value: "BullMQ 5 — sync-events, notifications, route-optimize, and reports queues" },
      { label: "Scale / Targets", value: "200,000+ students · 99.9% availability · 0.6 ms card-lookup p50 at 200k rows" },
    ],
    sections: [
      {
        title: "Key Features",
        items: [
          "RFID student attendance with GPS captured on every tap, resolving APPROVED / REJECTED / NOT_FOUND on the device in under 500 ms.",
          "Google-Maps-driven route optimization — a CVRP solver producing per-bus stop sequences with distance, fuel, and CO₂ analytics.",
          "Permanent per-bus QR verification with wrong-bus detection and audited operator overrides.",
          "Offline-first operation — the tap and QR screens keep working with no network and sync automatically when connectivity returns.",
          "Live operations dashboards with per-trip counters pushed to clients over Server-Sent Events.",
          "Async reporting — 12 report types rendered to CSV / XLSX / PDF and downloaded through short-lived tokenized links.",
        ],
      },
      {
        title: "Offline-First Attendance & Sync",
        items: [
          "The tap screen validates against a cached Dexie (IndexedDB) roster locally, so a verification decision never waits on the network.",
          "Taps queue in IndexedDB and flush to the API in batches of 200 — on an interval, on the browser 'online' event, and via service-worker Background Sync.",
          "Ingest is idempotent on a client-generated event id — re-sent batches are returned as duplicates and never double-counted.",
          "A backend outage is not a data-loss event: field capture continues and queued taps replay safely once the API is healthy.",
          "Roster snapshot + delta endpoints keep each device's offline cache current without re-downloading the full student list.",
        ],
      },
      {
        title: "Route Optimization & Live Dashboards",
        items: [
          "CVRP optimization runs as an async BullMQ job — the API returns 202 with a job id and the client polls for the result.",
          "With a Google Maps key it produces real road distances and polylines; without one it falls back to a haversine estimate mode with correct sequences, fuel, and CO₂.",
          "Fuel and CO₂ analytics use configurable emission factors (diesel 2.68, CNG 2.75 kg/L).",
          "Live per-trip counters live in Redis and stream to dashboards over SSE via Redis Pub/Sub — dashboards never poll the OLTP tables.",
          "Analytics endpoints serve aggregates, heatmaps, trends, and fuel breakdowns for the admin dashboard.",
        ],
      },
      {
        title: "Architecture & Data",
        items: [
          "A Next.js 15 PWA (operator tap screen, QR verify, admin dashboard) talks to a TypeScript / Express API exposed under /api/v1.",
          "PostgreSQL 16 + PostGIS 3.4 is the system of record, with geography columns for stops and GPS logs.",
          "Four high-volume event tables (attendance, GPS, audit, notifications) are monthly RANGE-partitioned and pre-created ahead of time by a maintenance job.",
          "Redis 7 backs refresh-token storage, live counters, rate limiting, SSE Pub/Sub, BullMQ queues, and report-download tokens.",
          "The environment is validated with Zod at boot and fails fast — the only thing that changes between local and production is connection strings and secrets.",
          "Prisma manages the core tables; the partitioned tables, PostGIS extensions, and stored functions are hand-authored raw SQL.",
        ],
      },
      {
        title: "Operations, Security & Scale",
        items: [
          "argon2id password hashing, enumeration-safe login, JWT access tokens (15 min, in memory) and rotating refresh tokens (7 days, httpOnly) with server-side jti revocation.",
          "RBAC across 8 roles and an 18-permission catalog, with entity → branch multi-tenancy scoped middleware-side on every data endpoint; users, branches, and entities are deactivated, never deleted.",
          "Token-bucket rate limiting on auth and tap endpoints (fail-open on a Redis outage by design), Helmet headers, a strict CORS allowlist, and audit logging of overrides and config writes.",
          "CI (GitHub Actions) spins up PostGIS + Redis, runs migrations and partitions, type-checks, builds, and runs 39 Vitest tests before any deploy.",
          "Health / readiness probes, structured pino logging with per-request trace ids, a pg_dump backup + restore runbook with quarterly restore drills, and scheduled monthly partition maintenance.",
          "Load-tested at 200,000 students — a 0.6 ms p50 RFID card lookup, targeting 99.9% availability; AWS (ECS / RDS / ElastiCache / S3 / CloudFront / WAF) is the documented production target.",
        ],
      },
    ],
  },
  {
    slug: "mess-management-system",
    title: "Mess Management System",
    category: "Key Project",
    role: "Full-Stack & DevOps",
    tech: ["Next.js", "React", "PostgreSQL", "Prisma", "Auth.js", "Docker", "Nginx"],
    infra: AWS_INFRA,
    summary:
      "Multi-branch RFID coupon system for mess / canteen operations — Next.js 16 + PostgreSQL/Prisma, with an offline-capable POS, online top-ups, and a self-healing payment pipeline.",
    overview:
      "A production, multi-branch platform for running a mess / canteen on RFID coupon cards. Staff tap cards at a counter to redeem meals; cardholders top up online through a payment gateway. It is a single Next.js 16 app (Route Handlers + Server Actions) on PostgreSQL via Prisma, deployed on EC2 behind Nginx with TLS. The whole design centres on money-correctness — an append-only coupon ledger, an idempotent reconciliation job that self-heals stuck online top-ups, and an offline-first counter that queues taps and replays them safely.",
    highlights: [],
    stack: [
      { label: "Type", value: "Multi-branch RFID coupon system · mess / canteen operations" },
      { label: "Application", value: "Next.js 16 (App Router) · React 19 — Route Handlers + Server Actions" },
      { label: "Datastore", value: "PostgreSQL 16 via Prisma 6.5 (Dockerized, localhost-only)" },
      { label: "Auth", value: "Auth.js v5 (mobile + password) with deny-by-default RBAC" },
      { label: "Counter", value: "Offline-first POS — service worker + IndexedDB tap queue" },
      { label: "Notifications", value: "Email (SMTP) · Web Push (VAPID) · WhatsApp" },
      { label: "Deployment", value: "EC2 · systemd · Nginx (TLS) · nightly pg_dump backups" },
    ],
    sections: [
      {
        title: "Key Features",
        items: [
          "RFID coupon redemption at the counter — tap a card to deduct a meal.",
          "Online top-ups through a payment gateway, credited to a coupon balance.",
          "Multi-branch operation with per-branch scoping and configuration.",
          "Offline-capable POS that keeps serving through network drops.",
          "Role-based staff access — Super Admin, branch admins, counter operators.",
          "Multi-channel notifications across email, web push, and WhatsApp.",
        ],
      },
      {
        title: "Architecture & Data",
        items: [
          "A single Next.js app (Route Handlers + Server Actions) with no separate API service; stateless by design, so Postgres holds all durable state.",
          "Append-only coupon ledger — corrections are reversal rows, never edits — with cached balances always re-derivable from the ledger.",
          "One idempotent crediting path shared by the live callback and the reconcile sweep, so a late callback can never double-credit.",
          "Offline taps queue in IndexedDB and replay idempotently on a client transaction ID.",
          "Every scoped query filters by the actor's branch; global master data is deliberately shared.",
        ],
      },
      {
        title: "Payments & Reliability",
        items: [
          "Self-healing reconciliation — a scheduled job re-checks pending top-ups against the gateway and credits or fails them, recovering dropped browser callbacks automatically.",
          "A 2-minute grace window lets the live callback win the race; orders stale past 24h are marked failed.",
          "Cron-invoked endpoints authenticated by a shared secret, with a session fallback.",
          "Daily notification digest with per-row retry for sends attempted before a channel was configured.",
        ],
      },
      {
        title: "Operations & Security",
        items: [
          "Single EC2 instance: Nginx (TLS via Let's Encrypt) → Next.js under systemd → Dockerized PostgreSQL bound to localhost only.",
          "Nightly pg_dump backups with 14-day retention and an optional offsite S3 copy.",
          "Forward-only Prisma migrations applied on deploy (migrate deploy).",
          "RBAC deny-by-default with a module.action permission grid; all secrets kept server-side.",
          "Audit log of every state-changing action (actor, action, before/after, IP, user-agent).",
          "Rate-limited public self-service endpoints (balance / history / pay).",
        ],
      },
    ],
  },
];

/* Grouping is driven by each project's `category`, so a project moves between
   "Key" and "Personal" simply by changing its category field above. */
const POOL: Project[] = [...GROUP_A, ...GROUP_B];

export const KEY_PROJECTS: Project[] = POOL.filter((p) => p.category === "Key Project");
export const PERSONAL_PROJECTS: Project[] = POOL.filter((p) => p.category === "Personal Project");
export const ALL_PROJECTS: Project[] = [...KEY_PROJECTS, ...PERSONAL_PROJECTS];

export function getProject(slug: string): Project | undefined {
  return ALL_PROJECTS.find((p) => p.slug === slug);
}

/** Map a tech token to a self-hosted logo where we have one (else undefined). */
const TECH_LOGOS: Record<string, string> = {
  "aws ec2": "ec2.svg",
  ec2: "ec2.svg",
  linux: "linux.svg",
  ubuntu: "ubuntu.svg",
  bash: "bash.svg",
  nginx: "nginx.svg",
  github: "github.svg",
  "github actions": "githubactions.svg",
  githubactions: "githubactions.svg",
  git: "git.svg",
  react: "react.svg",
  "next.js": "nextjs.svg",
  nextjs: "nextjs.svg",
  "node.js": "nodejs.svg",
  firebase: "firebase.svg",
  postgresql: "postgresql.svg",
  postgres: "postgresql.svg",
  prisma: "prisma.svg",
  mysql: "mysql.svg",
  python: "python.svg",
  java: "java.svg",
  typescript: "typescript.svg",
  javascript: "javascript.svg",
  docker: "docker.svg",
  grafana: "grafana.svg",
  // AWS services
  iam: "iam.svg",
  "aws iam": "iam.svg",
  cloudwatch: "cloudwatch.svg",
  "aws cloudwatch": "cloudwatch.svg",
  cloudtrail: "cloudtrail.svg",
  "route 53": "route53.svg",
  route53: "route53.svg",
  s3: "s3.svg",
  "aws s3": "s3.svg",
  rds: "rds.svg",
  "aws rds": "rds.svg",
  ecs: "ecs.svg",
  "aws ecs": "ecs.svg",
  elb: "elb.svg",
  dynamodb: "dynamodb.svg",
  vpc: "vpc.svg",
  lightsail: "lightsail.svg",
};

export function techLogo(name: string): string | undefined {
  const file = TECH_LOGOS[name.toLowerCase()];
  return file ? `/logos/tech/${file}` : undefined;
}
