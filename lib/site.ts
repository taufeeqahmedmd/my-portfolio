/**
 * Central site + person metadata. Everything SEO-related (metadata, JSON-LD,
 * sitemap, robots) reads from here so there is a single source of truth.
 *
 * ⚠️  SET YOUR REAL DOMAIN: either define NEXT_PUBLIC_SITE_URL in your build
 * environment (Cloudflare → Worker → Settings → Variables) or change the
 * fallback below. Using the wrong domain produces bad canonical URLs.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mohammedtaufeeqahmed.com"
).replace(/\/+$/, "");

/** Absolute URL helper for canonical / OG / sitemap links. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const SITE_NAME = "Mohammed Taufeeq Ahmed";

/** Primary description — front-loads the name + the common short forms people search. */
export const SITE_DESCRIPTION =
  "Mohammed Taufeeq Ahmed (also known as Taufeeq, Md Taufeeq, and Taufeeq Ahmed) is a Cloud & DevOps Engineer specializing in AWS, Docker, CI/CD, Linux and Nginx, with a full-stack background in React, Next.js and Node.js. Based in Hyderabad, India.";

/** Every way people spell / shorten the name — used in keywords and JSON-LD alternateName. */
export const NAME_VARIANTS = [
  "Taufeeq",
  "Md Taufeeq",
  "MD Taufeeq",
  "Mohammed Taufeeq",
  "Taufeeq Ahmed",
  "Md Taufeeq Ahmed",
  "MD Taufeeq Ahmed",
  "Mohammed Taufeeq Ahmed",
  "Mohammed Taufeeq Ahmed Cloud Engineer",
  "Taufeeq Cloud Engineer",
  "Taufeeq DevOps Engineer",
  "Taufeeq Full Stack Engineer",
];

export const SITE_KEYWORDS = [
  ...NAME_VARIANTS,
  "Cloud Engineer",
  "DevOps Engineer",
  "Full Stack Engineer",
  "Solutions Architect",
  "AWS Engineer",
  "Cloud Engineer Hyderabad",
  "AWS DevOps Hyderabad",
  "K-Innovative Hub",
];

/** Structured, factual profile used to build the Person JSON-LD graph. */
export const PERSON = {
  name: SITE_NAME,
  alternateName: NAME_VARIANTS,
  givenName: "Mohammed Taufeeq",
  familyName: "Ahmed",
  jobTitle: "Cloud & DevOps Engineer",
  worksFor: "K-Innovative Hub Pvt. Ltd.",
  alumniOf: "Anurag University (Anurag College of Engineering)",
  image: absoluteUrl("/portrait.png"),
  email: "mailto:mdtaufeeqahmed15@gmail.com",
  address: {
    locality: "Hyderabad",
    region: "Telangana",
    country: "IN",
  },
  sameAs: [
    "https://github.com/taufeeqahmedmd",
    "https://www.linkedin.com/in/mohammedtaufeeqahmed",
  ],
  knowsAbout: [
    "Amazon Web Services (AWS)",
    "Cloud Computing",
    "DevOps",
    "CI/CD",
    "Docker",
    "Linux",
    "Nginx",
    "Infrastructure as Code",
    "IAM & Cloud Security",
    "Next.js",
    "React",
    "Node.js",
    "TypeScript",
    "PostgreSQL",
  ],
} as const;
