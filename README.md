# Portfolio — Mohammed Taufeeq Ahmed

A poster-style personal portfolio for a Cloud / DevOps Engineer, built with
**Next.js (App Router + TypeScript)** and **Tailwind CSS v4**.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Add your photo

Drop a cut-out portrait into the `public/` folder named `portrait.png`
(`.jpg` / `.jpeg` / `.webp` also work). It auto-replaces the center placeholder.
Use a full-body cut-out on a transparent/dark background for the poster look.

## Customize

| What | Where |
| --- | --- |
| Name, role, bio, stats | `app/page.tsx` |
| GitHub link / username | `app/page.tsx` (`href` + display text under the GitHub block) |
| Tech stack pills | `app/page.tsx` (the `TECH ARSENAL` array) |
| Experience / certifications | `app/page.tsx` (`CAREER JOURNEY` section) |
| Colors, fonts, animations | `app/globals.css` (`@theme` tokens) |

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run start` — serve the production build
