# Bilingual blog merge plan

## Goal

Merge `mn-blog/` (Italian) and `mn-blog-en/` (English) into one Gatsby site in
`mn-blog/`, with both languages on one Netlify deployment.

- Italian: `/it/...`
- English: `/en/...`
- Root `/`: Netlify redirect based on `Accept-Language`
- Work is done on a fresh `translation` branch in `mn-blog/`
- Old Italian root URLs must keep working via 301 redirects
- Old English URLs are handled in a later, separate step on `mn-blog-en/`

## Decisions

- Base repo: `mn-blog/`
- Branch: reset the existing stale `translation` branch to `master`
- URL scheme: both languages prefixed (`/it`, `/en`)
- i18n: custom lightweight TypeScript dictionaries + React context
- Content: `src/content/it`, `src/content/en`, shared `src/content/img`
- Redirects: static `static/_redirects` for Netlify; no SSR, no
  `gatsby-plugin-netlify` dependency
- `gatsby-ssr.ts` usage is only build-time HTML generation, not runtime SSR

## Content mapping

All 18 Italian and 18 English posts form one-to-one pairs. Add a matching
`translationKey` to each pair. Use the Italian slug (without `.md`) as the key.

| Translation key | Italian file | English file |
| --- | --- | --- |
| `benvenuti` | `benvenuti.md` | `welcome-2016.md` |
| `come-rimuovere-i-virus-dal-computer` | `come-rimuovere-i-virus-dal-computer.md` | `how-to-remove-viruses-from-your-computer.md` |
| `come-migliorare-le-foto-con-nik-collection` | `come-migliorare-le-foto-con-nik-collection.md` | `how-to-improve-your-photos-with-nik-collection.md` |
| `come-scaricare-le-canzoni-da-soundcloud-in-pochi-semplici-click` | `come-scaricare-le-canzoni-da-soundcloud-in-pochi-semplici-click.md` | `how-to-download-songs-from-soundcloud-in-a-few-clicks.md` |
| `come-giocare-ai-videogiochi-di-due-o-tre-ere-fa` | `come-giocare-ai-videogiochi-di-due-o-tre-ere-fa.md` | `how-to-play-videogames-from-two-or-three-eras-ago.md` |
| `come-scaricare-i-video-da-youtube-con-il-terminale` | `come-scaricare-i-video-da-youtube-con-il-terminale.md` | `how-to-download-youtube-videos-with-the-terminal.md` |
| `come-essere-produttivi-con-il-terminale` | `come-essere-produttivi-con-il-terminale.md` | `how-to-be-productive-with-the-terminal.md` |
| `come-risolvere-le-regressioni-del-software-usando-git-bisect` | `come-risolvere-le-regressioni-del-software-usando-git-bisect.md` | `how-to-fix-software-regressions-using-git-bisect.md` |
| `11-lezioni-che-ho-imparato-lavorando-nelle-startup` | `11-lezioni-che-ho-imparato-lavorando-nelle-startup.md` | `11-lessons-i-learned-working-in-startups.md` |
| `come-sviluppare-in-test-driven-development-tdd-partendo-da-zero` | `come-sviluppare-in-test-driven-development-tdd-partendo-da-zero.md` | `how-to-develop-in-test-driven-development-tdd-from-scratch.md` |
| `creare-pipeline-ci-cd` | `creare-pipeline-ci-cd.md` | `how-to-create-a-ci-cd-pipeline.md` |
| `come-sviluppare-rest-api-in-tdd-con-spring-boot` | `come-sviluppare-rest-api-in-tdd-con-spring-boot.md` | `how-to-develop-rest-apis-in-tdd-with-spring-boot.md` |
| `benvenuto-2019` | `benvenuto-2019.md` | `welcome.md` |
| `come-automatizzare-con-ansible-tutorial` | `come-automatizzare-con-ansible-tutorial.md` | `how-to-automate-with-ansible.md` |
| `autenticazione-jwt-con-angular` | `autenticazione-jwt-con-angular.md` | `jwt-authentication-angular.md` |
| `sensore-qualita-aria-raspberry-pi` | `sensore-qualita-aria-raspberry-pi.md` | `air-quality-sensor-raspberry-pi.md` |
| `come-memorizzare-i-segreti-nei-repository-pubblici` | `come-memorizzare-i-segreti-nei-repository-pubblici.md` | `store-secrets-in-public-repositories.md` |
| `sei-cose-che-avrei-voluto-sapere-prima-di-diventare-engineering-manager` | `sei-cose-che-avrei-voluto-sapere-prima-di-diventare-engineering-manager.md` | `things-i-wish-i-knew-before-becoming-engineering-manager.md` |

## Implementation steps

### 1. Branch setup

```sh
git branch -f translation master
git switch translation
```

Keep `mn-blog-en/` untouched for now.

### 2. Merge content

- Move Italian posts to `src/content/it/`.
- Copy English posts to `src/content/en/`.
- Keep shared images at `src/content/img/` and avatars at
  `src/content/avatars/`.
- Add `translationKey` to every post's frontmatter.
- Rewrite image paths in frontmatter and body from `img/...` to `../img/...`.
- Move `tag.yaml` into each locale directory and use `../img/...` for tag
  images. Add `lang` and matching `translationKey` to tag entries.
- Keep a single shared `src/content/author.yaml`.
- Rewrite internal markdown links:
  - Italian `/slug` -> `/it/slug`
  - English `/slug` -> `/en/slug`
- Copy `img/before-engineering-manager/expand-influence.jpeg` from
  `mn-blog-en` if missing.
- Keep privacy-policy pages at their current root paths:
  - `/gaslow/privacy-policy`
  - `/metext/privacy-policy`
  - `/randommet/privacy-policy`

### 3. i18n infrastructure

Create `src/i18n/`:

- `config.ts`
  - `defaultLang`
  - supported languages
  - `getLangFromPath`
  - `localizedPath`
- `ui.ts`
  - All user-facing strings in Italian and English:
    - nav, footer
    - subscribe modal and form
    - sponsor buttons
    - share text
    - post card read time
    - read-next strings
    - tag/author post counts
    - 404 page
    - projects page
- `LanguageProvider.tsx`
  - exposes `lang`, strings, date locale, and language-switch helper

Wrap every page with the provider via `wrapPageElement` in:

- `gatsby-browser.tsx` (create)
- `gatsby-ssr.tsx` (extend)

Update components to use translations:

- `SiteNav` (convert class component to function or use a context consumer)
- `Footer`
- `PostCard`
- `ReadNextCard`
- `AuthorListItem`
- `Subscribe`, `SubscribeForm`, `SubscribeModal`
- `SponsorCall`, `BuyBeerBtn`, `SponsorGithubBtn`
- `ShareButtons`
- `404`

Replace hardcoded `date-fns` Italian locale with the locale selected by `lang`.
Replace the external English/Italian nav links with an internal language
switch. On post pages, the switch should go to the exact translated post.

### 4. Routing and templates

`gatsby-node.js`:

- Derive `lang` from the content directory.
- Add `fields.lang` and `fields.translationKey`.
- Create post pages with prefixed slugs:
  - `/it/<slug>/`
  - `/en/<slug>/`
- Create indexes:
  - `/it/`, `/it/2/`, ...
  - `/en/`, `/en/2/`, ...
- Compute prev/next within the same language only.
- Create tag pages:
  - `/it/tags/<tag>/`
  - `/en/tags/<tag>/`
- Create author pages:
  - `/it/author/<name>/`
  - `/en/author/<name>/`
- Pass `lang` and `translationPath` in page context.

Update template queries to filter by `fields.lang`:

- index
- post related posts
- tags
- author

Localize static pages:

- `src/pages/it/projects.tsx`
- `src/pages/en/projects.tsx`
- `src/pages/it/about.tsx`
- `src/pages/en/about.tsx`

`404`:

- Detect locale from the current path.
- Show latest posts from that locale.

`gatsby-config.js`:

- Keep `siteUrl: https://www.mattianatali.it`.
- Add separate feeds:
  - `/it/rss.xml`
  - `/en/rss.xml`
- Keep sitemap, robots, canonical URL plugins.

SEO:

- Add `hreflang` alternate links for `it`, `en`, and `x-default`.
- Ensure canonical URLs follow the prefixed paths.

`gatsby-ssr.ts`:

- Set `<html lang>` from `pathname` instead of the static config value.
- This remains build-time only.

### 5. Legacy Italian URL redirects

Use a plain `static/_redirects` file. Gatsby copies it to
`public/_redirects`, and Netlify picks it up. No SSR or extra plugin needed.

```txt
# Root: detect browser language
/  /en/  302!  Language=en
/  /it/  302!

# Legacy Italian posts (root -> /it/)
/benvenuti/  /it/benvenuti/  301
/benvenuto-2019/  /it/benvenuto-2019/  301
/autenticazione-jwt-con-angular/  /it/autenticazione-jwt-con-angular/  301
/come-automatizzare-con-ansible-tutorial/  /it/come-automatizzare-con-ansible-tutorial/  301
/come-essere-produttivi-con-il-terminale/  /it/come-essere-produttivi-con-il-terminale/  301
/come-giocare-ai-videogiochi-di-due-o-tre-ere-fa/  /it/come-giocare-ai-videogiochi-di-due-o-tre-ere-fa/  301
/come-memorizzare-i-segreti-nei-repository-pubblici/  /it/come-memorizzare-i-segreti-nei-repository-pubblici/  301
/come-migliorare-le-foto-con-nik-collection/  /it/come-migliorare-le-foto-con-nik-collection/  301
/come-rimuovere-i-virus-dal-computer/  /it/come-rimuovere-i-virus-dal-computer/  301
/come-risolvere-le-regressioni-del-software-usando-git-bisect/  /it/come-risolvere-le-regressioni-del-software-usando-git-bisect/  301
/come-scaricare-i-video-da-youtube-con-il-terminale/  /it/come-scaricare-i-video-da-youtube-con-il-terminale/  301
/come-scaricare-le-canzoni-da-soundcloud-in-pochi-semplici-click/  /it/come-scaricare-le-canzoni-da-soundcloud-in-pochi-semplici-click/  301
/come-sviluppare-in-test-driven-development-tdd-partendo-da-zero/  /it/come-sviluppare-in-test-driven-development-tdd-partendo-da-zero/  301
/come-sviluppare-rest-api-in-tdd-con-spring-boot/  /it/come-sviluppare-rest-api-in-tdd-con-spring-boot/  301
/creare-pipeline-ci-cd/  /it/creare-pipeline-ci-cd/  301
/11-lezioni-che-ho-imparato-lavorando-nelle-startup/  /it/11-lezioni-che-ho-imparato-lavorando-nelle-startup/  301
/sensore-qualita-aria-raspberry-pi/  /it/sensore-qualita-aria-raspberry-pi/  301
/sei-cose-che-avrei-voluto-sapere-prima-di-diventare-engineering-manager/  /it/sei-cose-che-avrei-voluto-sapere-prima-di-diventare-engineering-manager/  301

# Legacy Italian sections
/projects  /it/projects/  301
/about  /it/about/  301
/tags/:tag/  /it/tags/:tag/  301
/author/:author/  /it/author/:author/  301
/rss.xml  /it/rss.xml  301
```

Netlify normalizes trailing slashes, so one rule per path is enough.

Add `src/pages/index.tsx` as a local-development fallback that redirects to
`/it/` or `/en/` using `navigator.language`. On Netlify, the forced `/` rules
win.

### 6. Later: old English URLs on `mn-blog-en`

Do this in a separate step after the merged site is live. Add
`static/_redirects` on the `mn-blog-en` Netlify site:

```txt
/  https://www.mattianatali.it/en/  301
/:slug/  https://www.mattianatali.it/en/:slug/  301
/tags/:tag/  https://www.mattianatali.it/en/tags/:tag/  301
/author/:author/  https://www.mattianatali.it/en/author/:author/  301
/projects  https://www.mattianatali.it/en/projects/  301
/rss.xml  https://www.mattianatali.it/en/rss.xml  301
/gaslow/privacy-policy  https://www.mattianatali.it/gaslow/privacy-policy  301
/metext/privacy-policy  https://www.mattianatali.it/metext/privacy-policy  301
/randommet/privacy-policy  https://www.mattianatali.it/randommet/privacy-policy  301
```

### 7. Validation

- `npm install`
- `npm run lint`
- `npm run build`
- Add and run `npm run ts:check`
- Confirm generated routes exist for:
  - every Italian and English post
  - tag and author pages in both languages
  - `/it/rss.xml` and `/en/rss.xml`
  - sitemap
- Inspect `public/_redirects` for the expected legacy rules.
- Test on a Netlify deploy preview with `curl -I`:
  - old Italian post URL -> `/it/<slug>/`
  - `/projects` -> `/it/projects/`
  - `/tags/dev/` -> `/it/tags/dev/`
  - `/` with an English `Accept-Language` header -> `/en/`
  - `/` with any other language -> `/it/`
- Spot-check:
  - language switch on a post goes to the translated slug
  - dates and "min read" are localized
  - canonical and hreflang tags
  - feeds
  - images
