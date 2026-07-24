/** Native SVG diagrams a section can render — see components/BlogDiagram.tsx. */
export type BlogDiagram = "dns-resolution" | "dns-caching" | "dns-trace" | "dns-flow";

export type Blog = {
  slug: string;
  title: string;
  category: string;
  date: string; // ISO (YYYY-MM-DD)
  readMins: number;
  excerpt: string;
  tags: string[];
  intro: string;
  sections: { heading: string; body: string[]; diagram?: BlogDiagram }[];
};

export const BLOGS: Blog[] = [
  {
    slug: "how-dns-works",
    title: "How DNS Works: The Domain Name System Explained From Query to Answer",
    category: "Networking",
    date: "2026-07-24",
    readMins: 13,
    excerpt:
      "A complete, engineer-friendly guide to how DNS works — the four servers in a lookup, record types, caching, TTL, DNSSEC, and DNS in the cloud.",
    tags: ["DNS", "Networking", "DNSSEC", "TTL", "Cloud"],
    intro:
      "Every request you make on the internet starts with a question: 'what is the IP address for this name?' DNS — the Domain Name System — is the distributed, hierarchical directory that answers it. You type example.com, but the network only routes on numbers like 192.168.1.1 (IPv4) or 2400:cb00:2048:1::c629:d7a2 (IPv6). This guide walks the whole path — from the moment you hit Enter to the answer that comes back — and covers the caching, records, and security that make it fast and trustworthy.",
    sections: [
      {
        heading: "What DNS is and why it exists",
        body: [
          "DNS is a globally distributed naming system that translates human-readable domain names into the IP addresses machines actually use to reach each other. People remember names; routers move packets between numeric addresses. DNS is the translation layer that sits between the two.",
          "Two address families matter here. IPv4 uses a 32-bit scheme (192.168.1.1). IPv6 uses a 128-bit space (2400:cb00:2048:1::c629:d7a2) to support the ever-growing number of connected devices. A single domain can advertise both, and DNS hands back whichever record type the client asks for.",
          "The system is 'distributed' and 'hierarchical' on purpose — no single server holds the whole internet's records. Authority is delegated down a tree, which is what lets DNS scale to billions of names without a central bottleneck.",
        ],
      },
      {
        heading: "The four servers in a single lookup",
        diagram: "dns-resolution",
        body: [
          "A cold DNS lookup touches up to four kinds of server. First is the DNS recursor (the recursive resolver) — the server your browser or OS talks to directly. Its job is to do all the legwork and return a final answer. If it has the record cached, it replies instantly; if not, it walks the hierarchy on your behalf. Common examples are your ISP's resolver and public ones like Google DNS (8.8.8.8) and Cloudflare (1.1.1.1).",
          "Second is the root nameserver — the top of the tree. It doesn't know individual domain IPs; it points the resolver to the right Top-Level Domain (TLD) server based on the extension (.com, .org, .net). Third is the TLD nameserver, which manages every domain under one extension and returns the NS records telling the resolver which authoritative server owns the domain.",
          "Fourth is the authoritative nameserver — the source of truth for a domain's records. It gives the definitive answer, including the record and its TTL. The resolver caches that response and hands the IP back to the client, which then connects directly to the target server.",
        ],
      },
      {
        heading: "Recursive resolver vs authoritative server",
        body: [
          "These are easy to confuse because both are 'DNS servers,' but they play opposite roles. The recursive resolver finds the answer; the authoritative server has the answer. The resolver receives the client's query, checks its cache, and — on a miss — queries root, TLD, and authoritative servers in turn, following referrals and applying TTL-based caching. It owns no records; it just knows where to ask.",
          "The authoritative server does the reverse: it answers only from its own zone data, never queries other servers, and returns the definitive record with a TTL. It owns the data and gives definitive answers. In practice, the authoritative servers are the nameservers you configure at your domain registrar.",
        ],
      },
      {
        heading: "The DNS records you'll actually touch",
        body: [
          "An A record maps a name to an IPv4 address — the most common record and the one that tells a browser where to connect. An AAAA record does the same for IPv6, and modern clients usually prefer IPv6 when both exist. A CNAME creates an alias from one name to another name (not an IP), which is handy for subdomains and service endpoints because you can repoint one target without editing many records.",
          "An MX record names the mail servers that receive email for a domain, each with a priority value so lower numbers are tried first — that's your failover and load-balancing for mail. A TXT record stores arbitrary text and is the workhorse of domain verification and email security (SPF, DKIM, DMARC), which help stop spoofing.",
          "NS records declare the authoritative nameservers for a domain and are how DNS delegation works. The SOA (Start of Authority) record holds zone metadata — primary nameserver, serial number, and the refresh/retry/expire timers that govern zone transfers. Finally, a PTR record maps an IP back to a name for reverse lookups.",
        ],
      },
      {
        heading: "Walking a full lookup, step by step",
        diagram: "dns-flow",
        body: [
          "When you enter a domain, the resolver is the first component involved — the interface between your client and the wider DNS infrastructure. On an uncached lookup it mixes recursive and iterative queries: it asks a root server, gets a referral to the TLD, asks the TLD, gets a referral to the authoritative nameserver, and finally asks the authoritative server for the record.",
          "It's worth separating two similar terms. A recursive query is the request the client sends asking for a complete answer. A recursive resolver is the server that accepts that request and does all the lookups on the client's behalf. Once the resolver has the IP, it returns it and caches it according to the TTL to speed up future requests.",
          "Subdomains add one wrinkle. For something like admin.example.com, the authoritative server may return a CNAME; the resolver follows it, possibly queries another authoritative server, and returns the final A or AAAA record. Despite all these hops, the whole thing usually completes in milliseconds.",
        ],
      },
      {
        heading: "A real trace: resolving iamtaufeeq.cloud",
        diagram: "dns-trace",
        body: [
          "Let's make it concrete with an actual name. Say your browser needs to reach iamtaufeeq.cloud and nothing is cached anywhere yet. Your browser asks its recursive resolver — here Cloudflare's 1.1.1.1 — for the domain's A record, then waits for one final answer.",
          "The resolver has nothing cached, so it starts at the top. A root nameserver refers it to the .cloud TLD servers; the .cloud TLD server hands back an NS record naming the domain's authoritative nameserver; and that authoritative server returns the definitive record: iamtaufeeq.cloud. 300 IN A 203.0.113.42. That single line says the name maps to the IPv4 address 203.0.113.42, cacheable for 300 seconds — the IP here is just an illustrative example.",
          "The resolver caches that answer for its TTL — 300 seconds, or five minutes — and hands 203.0.113.42 back to your browser, which opens a connection straight to it. Any later visitor whose resolver already holds this record skips the entire walk and gets the IP instantly. And if the domain also published an AAAA record, an IPv6-capable client would typically prefer that instead.",
        ],
      },
      {
        heading: "Three types of DNS queries",
        body: [
          "A recursive query is one where the client expects a complete, final answer. It hands the whole job to the recursive resolver and doesn't contact any other server itself — the resolver either returns the record or an error after querying root, TLD, and authoritative servers as needed.",
          "An iterative query returns the best response a server can give right now — often a referral to a server closer to the authoritative source rather than the final answer. The resolver follows these referrals until it gets the record, times out, or errors. Iterative queries are mostly what happens between DNS servers during resolution.",
          "A non-recursive query happens when the server already has the answer — it's authoritative for the domain or the record is cached. No further lookups are needed, so these resolve almost instantly and reduce load on upstream servers, which is a big part of what keeps DNS efficient at scale.",
        ],
      },
      {
        heading: "TTL and multi-layer DNS caching",
        diagram: "dns-caching",
        body: [
          "TTL (Time-To-Live) is a value on each record that says how long resolvers, operating systems, and browsers may cache it before refreshing from the authoritative source. An A record with a TTL of 300 seconds can be cached for five minutes; after that, the next lookup fetches a fresh copy. TTL is the dial that trades propagation speed against query volume.",
          "Caching happens at multiple layers, closest-first. The browser cache is checked first and is the fastest possible hit. Next is the OS-level cache, handled by the stub resolver — the last local checkpoint before a query leaves your machine. Then comes the recursive resolver's cache, which is large and shared across many users.",
          "That layering is why real-world DNS beats the textbook path. If the resolver already has the A record, it returns it immediately. If it only has cached NS records for the authoritative nameservers, it can skip root and TLD and go straight to the source. Only a full cache miss triggers the complete root → TLD → authoritative walk.",
        ],
      },
      {
        heading: "Reverse DNS and PTR records",
        body: [
          "Reverse DNS does the opposite of a normal lookup: it resolves an IP address back to a hostname using PTR records. IPv4 lookups live under the special in-addr.arpa domain with the address reversed — 192.0.2.1 is queried as 1.2.0.192.in-addr.arpa. IPv6 works the same way under ip6.arpa, with each hex digit reversed. If no PTR record exists, the reverse lookup simply fails.",
          "This matters most for email. Mail servers routinely run a reverse lookup on a sender's IP; if it doesn't map to a valid domain, the message may be rejected or flagged as spam, which cuts down on spoofing. Logging and monitoring tools also use reverse DNS to turn raw IPs into readable names. Note that PTR records are usually managed by whoever owns the IP block, not the domain owner.",
        ],
      },
      {
        heading: "Common DNS errors and negative caching",
        body: [
          "Not every query returns an IP. NXDOMAIN means the domain doesn't exist — the authoritative server confirms there are no records, often the result of a typo or an unregistered name. SERVFAIL is a general server-side failure: the server couldn't complete the lookup because of misconfiguration, an unreachable authoritative server, or a DNSSEC validation failure. It does not mean the domain is missing.",
          "REFUSED means a server deliberately declined to answer — usually access-control policy, such as a resolver that only serves certain clients. Timeouts happen when no response arrives in time, typically from network issues, overloaded servers, firewalls, or packet loss, and they show up as slow or flaky page loads.",
          "Errors can be cached too — a behavior called negative caching. When a resolver gets an NXDOMAIN, it may remember it for a duration set by the TTL or the SOA record's negative-caching value. That reduces repeated failed queries, but it's also why a freshly added or fixed record can appear 'broken' for a while until the negative cache expires.",
        ],
      },
      {
        heading: "Root servers: why there are only 13 addresses",
        body: [
          "A root server sits at the very top of the hierarchy, in the root zone. Root servers don't hold individual domain records; their job is to direct queries to the right TLD server. Every uncached lookup ultimately begins here, which makes the root zone critical internet infrastructure.",
          "The famous '13 root servers' is a misconception. There are 13 root server IP addresses, labeled A through M — a limit rooted in the original DNS protocol design — but each address is a global network, not one machine. Thanks to anycast routing, hundreds of physical instances share each address, and there are over 600 instances deployed worldwide for availability and resilience.",
          "Resolvers can't discover root servers through DNS itself — the root is the top of the tree — so the 13 addresses are hardcoded into resolver software. ICANN oversees the root, operating one address directly and delegating the rest to trusted organizations like Verisign, NASA, and the University of Maryland. If one root goes down, resolvers simply retry another, and the internet keeps running.",
        ],
      },
      {
        heading: "Primary vs secondary DNS, and dynamic DNS",
        body: [
          "A primary DNS server hosts the master copy of a zone file — the authoritative database of all a domain's records, plus admin details. It's where you create and update records, and each zone has exactly one primary. When you change an IP or add a subdomain, you do it here, and the primary then propagates the change to secondaries via a zone transfer (AXFR or IXFR).",
          "A secondary DNS server keeps a read-only copy pulled from the primary. You can't edit records on it directly; it exists for redundancy, availability, and load distribution. If the primary goes offline, secondaries keep answering, and spreading queries across multiple authoritative servers (often via round-robin) reduces overload risk. Registrars frequently require at least one secondary as best practice.",
          "Dynamic DNS (DDNS) solves a different problem: keeping a name pointed at a machine whose IP keeps changing — home labs, personal servers, or anything on an ISP-assigned dynamic address. A DDNS client detects the new IP and updates the record automatically, so the name stays valid without paying for a static IP.",
        ],
      },
      {
        heading: "DNS security: attacks and DNSSEC",
        body: [
          "Because DNS is foundational and often unauthenticated by default, it's a frequent target. DNS spoofing feeds a client false answers so it resolves a name to the wrong IP, often for phishing. Cache poisoning is a nastier variant that injects bad records into a recursive resolver's cache, affecting everyone who uses it. DNS hijacking redirects queries by tampering with the record at the nameserver itself.",
          "Volumetric and resource attacks round out the picture: amplification attacks abuse spoofed source IPs to flood a victim with large DNS responses; tunneling smuggles data through DNS queries to evade firewalls; and NXDOMAIN, random-subdomain, phantom-domain, and domain-lock-up floods all exhaust resolver or authoritative-server resources with junk or slow responses.",
          "DNSSEC (DNS Security Extensions) is the answer to spoofing and poisoning. It digitally signs DNS data so resolvers can verify a response is authentic and unaltered, using a hierarchical chain of trust: the root signs the TLD's key, the TLD signs the domain's key, and the authoritative server signs the records. If validation fails anywhere, the response is rejected. It's backward-compatible and meant to complement TLS, not replace it. Beyond DNSSEC, operators over-provision capacity, deploy DNS firewalls for rate-limiting and cached failover, and privacy standards like DNS over TLS (DoT) and DNS over HTTPS (DoH) encrypt queries that were historically sent in plaintext.",
        ],
      },
      {
        heading: "DNS zones and zone files",
        body: [
          "A DNS zone is an administrative slice of the namespace managed by one organization — the boundary within which records are maintained and authoritative servers answer. A common misconception is that a zone equals a single domain or a single server; in reality a zone can span multiple subdomains, and one server can host many zones. Zones are logical delegation boundaries, not physical ones.",
          "All of a zone's data lives in a zone file: a plain-text database of every record in the zone. A zone file always begins with an SOA record carrying the zone's control information, including the administrator's contact. A reverse lookup zone is a special case that maps IPs back to hosts — the inverse of most zones — used for troubleshooting, spam filtering, and bot detection.",
        ],
      },
      {
        heading: "DNS in the cloud and microservices",
        body: [
          "In modern cloud systems, DNS is still the backbone of service discovery and traffic routing. A domain usually points at a load balancer rather than a single server: DNS resolves the name to the balancer's IP, and the balancer spreads requests across backend instances. That enables horizontal scaling and lets infrastructure change without exposing internal details to clients.",
          "CDNs lean on DNS heavily. Responses are often tailored to the client's location, returning the IP of the nearest edge server so content is delivered from close by — a big reason CDNs feel fast globally. In microservices, platforms like Kubernetes assign DNS names to services so apps find each other by stable names instead of hard-coded IPs, and tools like Consul expose a DNS interface to resolve instances as they scale and move.",
          "The through-line is loose coupling. Services can change IPs, scale, or migrate across regions without touching application config, because DNS abstracts physical addresses behind logical names. That's exactly what makes cloud-native architectures resilient and flexible — and it's why understanding DNS pays off well beyond networking.",
        ],
      },
    ],
  },
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
