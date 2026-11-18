# Mattia Natali's blog

Bilingual (Italian/English) static blog built with Astro.

## Commands

- `npm ci` — install dependencies
- `npm run dev` — start the dev server
- `npm run check` — type-check `.astro` files
- `npm run build` — generate the static site in `dist/`
- `npm run preview` — preview the built site locally

## Deployment

Netlify runs `npm run build` and publishes `dist/`. Redirects are defined in `public/_redirects`; content lives in `src/content/`.
