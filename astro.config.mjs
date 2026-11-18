import { defineConfig } from 'astro/config';
import { SITE_URL } from './site.mjs';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import rehypeRaw from 'rehype-raw';

import rehypeResponsiveIframe from './src/lib/rehype-responsive-iframe.mjs';

export default defineConfig({
  site: SITE_URL.replace(/\/$/, ''),
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  image: {
    layout: 'constrained',
    responsiveStyles: true,
    breakpoints: [640, 960, 1280, 1920],
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
    syntaxHighlight: 'prism',
    processor: unified({
      rehypePlugins: [rehypeRaw, rehypeResponsiveIframe],
    }),
  },
  integrations: [
    sitemap({
      filter: (page) => new URL(page).pathname !== '/' && !page.endsWith('/rss.xml'),
    }),
  ],
});
