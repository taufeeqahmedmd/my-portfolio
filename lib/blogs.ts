export type Blog = {
  slug: string;
  title: string;
  category: string;
  date: string; // ISO (YYYY-MM-DD)
  readMins: number;
  excerpt: string;
  tags: string[];
  intro: string;
  sections: { heading: string; body: string[] }[];
};

export const BLOGS: Blog[] = [
  {
    slug: "production-ready-aws-ec2",
    title: "Production-Ready AWS: Shipping Web Apps on EC2 Without the 3 a.m. Pages",
    category: "Cloud",
    date: "2026-06-18",
    readMins: 7,
    excerpt:
      "The unglamorous checklist that turns a lone EC2 instance into a resilient, observable, and secure production host.",
    tags: ["AWS", "EC2", "Nginx", "CI/CD", "IAM"],
    intro:
      "A single EC2 instance can serve a real product to real users — but the gap between 'it works on my machine' and 'it survives a Monday-morning traffic spike' is filled with unglamorous, easily-skipped work. Here's the checklist I run through before calling an AWS deployment production-ready.",
    sections: [
      {
        heading: "Least-privilege IAM from day one",
        body: [
          "It's tempting to attach broad admin access to everything and move on. Don't. Create a dedicated IAM role for the instance with only the permissions it actually needs — read from one S3 bucket, write to CloudWatch Logs, pull from ECR.",
          "Scope human access with separate users and MFA, and never bake long-lived keys into the app. Instance roles hand out short-lived credentials automatically, which is one fewer secret to leak.",
        ],
      },
      {
        heading: "Nginx, TLS, and a reverse proxy that behaves",
        body: [
          "Put Nginx in front of your app process. It terminates TLS (grab a free certificate with Certbot), serves static assets efficiently, and shields your Node/Next process from slow clients.",
          "Two settings people forget: sensible timeouts, and disabling proxy buffering on any streaming or Server-Sent-Events endpoint — otherwise live features stall behind the proxy.",
        ],
      },
      {
        heading: "Make deploys boring with CI/CD",
        body: [
          "Manual 'SSH in and git pull' deploys work right up until the day they don't. A GitHub Actions workflow that builds, tests, and ships on every merge turns releases into a non-event.",
          "Build the new version while the old one keeps serving, then swap — a few seconds of overlap beats a few minutes of downtime.",
        ],
      },
      {
        heading: "Observability before you need it",
        body: [
          "You cannot fix what you cannot see. Ship logs and metrics to CloudWatch, add a /health endpoint that actually checks the database, and set one alarm that pages you when errors spike or the disk runs low.",
          "The goal isn't a wall of dashboards — it's getting notified before your users are the ones telling you something broke.",
        ],
      },
    ],
  },
  {
    slug: "ai-in-the-developer-workflow",
    title: "AI in the Developer Workflow: From Autocomplete to Autonomous Agents",
    category: "AI",
    date: "2026-05-30",
    readMins: 6,
    excerpt:
      "AI assistants have moved from fancy autocomplete to teammates that read, plan, and refactor. Here's how to use them without losing the plot.",
    tags: ["AI", "LLMs", "Developer Experience", "Agents"],
    intro:
      "AI assistants have gone from fancy autocomplete to something closer to a junior teammate that can read a codebase, propose a plan, and open a pull request. Used well, they compress the boring parts of the job. Used carelessly, they generate confident nonsense at scale. The difference is workflow.",
    sections: [
      {
        heading: "The new inner loop",
        body: [
          "The tight edit–run–debug loop now has a third participant. Instead of context-switching to docs or forums, you describe intent and get a first draft in place.",
          "The skill that matters is no longer recalling syntax — it's specifying the problem clearly and reviewing the output critically.",
        ],
      },
      {
        heading: "Where agents actually help",
        body: [
          "Agents shine on well-scoped, verifiable tasks: writing tests for existing code, migrating a pattern across dozens of files, drafting boilerplate, or explaining an unfamiliar module.",
          "They struggle where requirements are ambiguous or the feedback loop is slow — exactly the places where a human still needs to hold the design in their head.",
        ],
      },
      {
        heading: "Keeping humans in the loop",
        body: [
          "Treat generated code the way you'd treat a colleague's PR: read it, question it, run it. The moment you ship something you don't understand, you've traded short-term speed for long-term risk.",
          "The most productive setups keep the human as the editor-in-chief, not a rubber stamp.",
        ],
      },
      {
        heading: "Guardrails that scale",
        body: [
          "Tests, types, and CI are what let you move fast with AI without breaking things. They turn 'looks right' into 'provably works' — the only way to trust output you didn't write line by line.",
        ],
      },
    ],
  },
  {
    slug: "ai-on-the-cloud-serverless-inference",
    title: "AI on the Cloud: Serverless Inference and MLOps the Pragmatic Way",
    category: "AI · Cloud",
    date: "2026-07-10",
    readMins: 8,
    excerpt:
      "You don't need a GPU cluster to ship AI features. A pragmatic look at serverless inference, cost control, and MLOps on AWS.",
    tags: ["AWS", "MLOps", "Serverless", "Inference"],
    intro:
      "'AI on the cloud' conjures images of GPU clusters and seven-figure bills. For most product teams, the reality is far more modest — and far more achievable. You can ship genuinely useful AI features with serverless inference, managed models, and a bit of discipline around cost.",
    sections: [
      {
        heading: "Serverless inference: when it fits",
        body: [
          "If your traffic is spiky and your latency budget is forgiving, serverless inference is a gift — you pay per request and scale to zero between them. Managed model endpoints and hosted LLM APIs remove the need to babysit GPUs entirely.",
          "The trade-off is cold starts and per-token pricing, so it fits chat, summarization, and background enrichment better than real-time, high-QPS paths.",
        ],
      },
      {
        heading: "Cost is a first-class feature",
        body: [
          "With AI, cost is a product decision, not an afterthought. Cache aggressively, pick the smallest model that clears your quality bar, and cap token usage per request.",
          "Set billing alarms early. The failure mode of AI on the cloud isn't downtime — it's a surprise invoice.",
        ],
      },
      {
        heading: "MLOps without a platform team",
        body: [
          "You don't need a dedicated ML platform to be responsible. Version your prompts and models like code, log inputs and outputs (minus anything sensitive), and always keep a rollback path.",
          "Treat a prompt change like a deploy: reviewed, tested against a few known cases, and reversible.",
        ],
      },
      {
        heading: "Observability for models",
        body: [
          "Traditional metrics tell you the service is up; they don't tell you the answers got worse. Track quality signals — user feedback, refusal rates, latency, and cost per request — and sample real outputs regularly.",
          "Models drift, providers change, and prompts rot. The teams that win treat evaluation as an ongoing habit, not a launch-day checkbox.",
        ],
      },
    ],
  },
];

export function getBlog(slug: string): Blog | undefined {
  return BLOGS.find((b) => b.slug === slug);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[(m ?? 1) - 1]} ${d}, ${y}`;
}
