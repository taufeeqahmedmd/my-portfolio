import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, PERSON, absoluteUrl } from "@/lib/site";
import type { Blog } from "@/lib/blogs";
import type { Project } from "@/lib/projects";

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/** The Person entity — the core signal for ranking on name searches. */
function person() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: PERSON.name,
    alternateName: PERSON.alternateName,
    givenName: PERSON.givenName,
    familyName: PERSON.familyName,
    jobTitle: PERSON.jobTitle,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    mainEntityOfPage: SITE_URL,
    image: PERSON.image,
    email: PERSON.email,
    worksFor: { "@type": "Organization", name: PERSON.worksFor },
    alumniOf: { "@type": "CollegeOrUniversity", name: PERSON.alumniOf },
    address: {
      "@type": "PostalAddress",
      addressLocality: PERSON.address.locality,
      addressRegion: PERSON.address.region,
      addressCountry: PERSON.address.country,
    },
    knowsAbout: PERSON.knowsAbout,
    sameAs: PERSON.sameAs,
  };
}

function website() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
  };
}

/** Site-wide graph — rendered on every page so the entity is reinforced everywhere. */
export function siteGraph() {
  return { "@context": "https://schema.org", "@graph": [person(), website()] };
}

/** ProfilePage wrapper for the home page — marks the site as the person's profile. */
export function profilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profilepage`,
    url: SITE_URL,
    name: `${SITE_NAME} — Cloud & DevOps Engineer`,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    mainEntity: { "@id": PERSON_ID },
    inLanguage: "en",
  };
}

export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function blogPostingSchema(b: Blog) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": absoluteUrl(`/blog/${b.slug}`) + "#article",
    headline: b.title,
    description: b.excerpt,
    datePublished: b.date,
    dateModified: b.date,
    inLanguage: "en",
    keywords: b.tags.join(", "),
    articleSection: b.category,
    image: PERSON.image,
    author: { "@id": PERSON_ID, name: PERSON.name, url: SITE_URL },
    publisher: { "@id": PERSON_ID, name: PERSON.name },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/blog/${b.slug}`) },
    url: absoluteUrl(`/blog/${b.slug}`),
  };
}

export function projectSchema(p: Project) {
  const tech = [...p.tech, ...(p.infra ?? [])];
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": absoluteUrl(`/projects/${p.slug}`) + "#project",
    name: p.title,
    headline: p.title,
    description: p.summary,
    abstract: p.overview,
    inLanguage: "en",
    keywords: tech.join(", "),
    about: p.category,
    url: absoluteUrl(`/projects/${p.slug}`),
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/projects/${p.slug}`) },
    creator: { "@id": PERSON_ID, name: PERSON.name, url: SITE_URL },
    author: { "@id": PERSON_ID, name: PERSON.name },
  };
}
