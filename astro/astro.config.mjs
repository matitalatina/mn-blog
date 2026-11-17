import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeRaw from 'rehype-raw';

import rehypeGatsbyHighlight from './src/lib/rehype-gatsby-highlight.mjs';
import rehypeResponsiveIframe from './src/lib/rehype-responsive-iframe.mjs';

export default defineConfig({
  site: 'https://www.mattianatali.it',
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
      filter: (page) => page !== 'https://www.mattianatali.it/' && !page.endsWith('/rss.xml'),
    }),
  ],
});
