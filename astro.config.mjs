import { defineConfig } from 'astro/config';
import { SITE_URL } from './site.mjs';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeRaw from 'rehype-raw';

import rehypeGatsbyHighlight from './src/lib/rehype-gatsby-highlight.mjs';
import rehypeResponsiveIframe from './src/lib/rehype-responsive-iframe.mjs';

export default defineConfig({
  site: SITE_URL.replace(/\/$/, ''),
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  markdown: {
    syntaxHighlight: false,
    processor: unified({
      rehypePlugins: [
        rehypeRaw,
        [rehypePrismPlus, { ignoreMissing: true, showLineNumbers: false }],
        rehypeGatsbyHighlight,
        rehypeResponsiveIframe,
      ],
    }),
  },
  integrations: [
    sitemap({
      filter: (page) => new URL(page).pathname !== '/' && !page.endsWith('/rss.xml'),
    }),
  ],
});
