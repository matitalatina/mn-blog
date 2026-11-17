# Astro migration plan

Status: in progress
Owner: Mattia Natali
Decision: migrate the Gatsby blog to Astro 7 in `astro/`, pixel-perfect port.

## Locked decisions

- Target: **Astro 7** (current major, Node >= 22.23.4; local Node is 24).
- Build location: `astro/` subdirectory in this repo, branch `astro`.
- Gatsby stays at the repo root and remains deployable during the build.
- Final layout (later, outside this plan): move `astro/` to the repo root,
  delete Gatsby, point Netlify at the new build. Do **not** change Netlify now.
- Visual fidelity: **pixel-perfect**.
- Interactivity: Astro components + small vanilla JS. No React runtime.
- Hosting target: Netlify, but no Netlify changes in this phase.
- Remove `.circleci/` (user decision).
- Local verification is done by the user with Astro commands.

## Scope of this phase

Create a self-contained Astro app in `astro/` that renders the existing
bilingual blog at the exact same URLs, with the same look and behavior.
No root move, no Gatsby deletion, no Netlify/production changes.

## Astro 7 specifics to remember

- Astro 7 defaults to the **Sätteri** markdown processor. To use
  remark/rehype plugins (Prism, iframe wrapper) use the **Unified**
  processor from `@astrojs/markdown-remark`:
  `markdown.processor: unified({ remarkPlugins, rehypePlugins })`.
- Built-in smart punctuation is on by default (equivalent to
  `remark-smartypants`). Avoid double-processing.
- For pixel-perfect code blocks, use Prism (`rehype-prism-plus`) and the
  existing okaidia `.token` CSS. Do not use Astro's default Shiki.
- `trailingSlash: 'always'` + `build.format: 'directory'` to match Gatsby's
  `/slug/index.html` output and trailing-slash URLs.
- `@astrojs/sitemap` with i18n generates `sitemap-index.xml` + `sitemap-0.xml`.
- Astro copies `public/` verbatim to `dist/`; put `_redirects` in
  `astro/public/_redirects`.

## Target structure

```
astro/
  package.json
  package-lock.json
  astro.config.mjs
  tsconfig.json
  .nvmrc
  src/
    content.config.ts
    content/{it,en}/*.md
    content/{img,avatars}/
    data/{tag.yaml,author.yaml}
    i18n/{config.ts,ui.ts,projects.ts}
    layouts/BaseLayout.astro
    components/*.astro
    pages/
      index.astro
      [lang]/index.astro
      [lang]/[slug].astro
      [lang]/tags/[tag].astro
      [lang]/author/[author].astro
      [lang]/about.astro
      [lang]/projects.astro
      [lang]/rss.xml.ts
      gaslow/privacy-policy.astro
      metext/privacy-policy.astro
      randommet/privacy-policy.astro
      404.astro
    styles/{global.css,shared.css}
    website-config.ts
  public/
    _redirects
    favicon.png
    robots.txt
```

## URL parity checklist

- `/it/`, `/en/`
- `/it/<slug>/`, `/en/<slug>/` (36 posts)
- `/it/tags/<kebab>/`, `/en/tags/<kebab>/`
- `/it/author/mattia-natali/`, `/en/author/mattia-natali/`
- `/it/about/`, `/en/about/`, `/it/projects/`, `/en/projects/`
- `/gaslow/privacy-policy/`, `/metext/privacy-policy/`, `/randommet/privacy-policy/`
- `/it/rss.xml`, `/en/rss.xml`
- `/` language redirect (Netlify rules; local fallback page)
- Legacy 301s from `static/_redirects` copied to `astro/public/_redirects`
- Use `lodash.kebabCase` for tag/author slugs to match Gatsby exactly.

## Pixel-perfect port notes

- Global CSS from `src/layouts/index.tsx` copied verbatim; precompute
  `polished` lighten/darken values to hex/CSS variables.
- `src/styles/shared.ts` and `src/styles/colors.ts` translated to CSS.
- `src/components/PostContent.tsx` CSS copied verbatim, including the
  okaidia Prism theme, tables, blockquotes, `hr`, iframes, `.post-content`.
- Post cover image: fixed-height 800px figure, cover fit, border-radius 5px.
- Post card image: 200px height, border-radius 5px 5px 0 0; large card
  min-height 380px.
- Author avatar: 60x60, border-radius 100%.
- Breakpoints to verify: 500, 700, 795, 800, 1040, 1170 px; dark mode.
- `gatsby-remark-images` -> Astro markdown image optimization.
- `gatsby-remark-responsive-iframe` -> custom rehype plugin wrapping
  iframes in `.gatsby-resp-iframe-wrapper` with the same aspect ratio.
- `gatsby-remark-copy-linked-files` not needed: content has only external
  links, internal `/it/` `/en/` links, and iframes.
- Interactions: nav title-on-scroll, subscribe modal, share links,
  language switch. Vanilla JS only.
- Same favicon, fonts (system stack), gtag ID, Mailchimp form.

## Implementation order

1. Save this plan.
2. Create `astro/` skeleton + package.json + config.
3. Copy content, images, avatars, YAML, favicon, `_redirects`.
4. Content collections, helpers, i18n, site config.
5. Global/shared CSS.
6. Components and layouts.
7. Routes/pages/RSS.
8. SEO/head/sitemap/robots/gtag/mailchimp.
9. Root tooling: `.eslintignore` add `astro`; root `tsconfig.json`
   exclude `astro`; `.gitignore` change `public/` to `/public/`, add
   `astro/dist/`, `astro/.astro/`; delete `.circleci/`.
10. Install, build, fix errors, verify routes and visuals.

## Local commands

```sh
npm --prefix astro install
npm --prefix astro run dev       # http://localhost:4321
npm --prefix astro run build
npm --prefix astro run preview
npm --prefix astro run check
```

## Acceptance criteria

- All existing URLs render in Astro with the same slug.
- Visual parity on home, post, tag, author, about, projects, privacy, 404.
- Interactions work with no React runtime.
- Astro build and typecheck pass.
- No Gatsby/Netlify production changes.

## Deferred (next step, outside this plan)

- Move `astro/` to repo root.
- Delete Gatsby files.
- Point Netlify at the Astro build (`dist`), update Node version.
- Production cutover after user approval.
