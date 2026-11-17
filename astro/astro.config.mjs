import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeRaw from 'rehype-raw';

import rehypeGatsbyHighlight from './src/lib/rehype-gatsby-highlight.mjs';
import rehypeResponsiveIframe from './src/lib/rehype-responsive-iframe.mjs';
import rehypeResponsiveImages from './src/lib/rehype-responsive-images.mjs';

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
        rehypeResponsiveImages,
      ],
    }),
  },
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/rss.xml'),
      i18n: {
        defaultLocale: 'it',
        locales: {
          it: 'it-IT',
          en: 'en-US',
        },
      },
    }),
  ],
});
