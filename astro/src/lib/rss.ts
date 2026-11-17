import rss from '@astrojs/rss';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { render } from 'astro:content';
import type { APIContext } from 'astro';

import { getPosts } from './content';
import type { Lang } from './i18n';
import config from '../website-config';

interface RssFeedOptions {
  lang: Lang;
  title: string;
  description: string;
}

const escapeXml = (value: string): string =>
  value.replace(
    /[<>&"']/g,
    character =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;',
      })[character] ?? character,
  );

export const createRssGET = ({ lang, title, description }: RssFeedOptions) => {
  return async (context: APIContext) => {
    const posts = await getPosts(lang);
    const container = await AstroContainer.create();
    const site = config.siteUrl.replace(/\/$/, '');
    const items = await Promise.all(
      posts.map(async post => {
        const { Content } = await render(post.entry);
        const content = await container.renderToString(Content);
        const url = `${site}${post.slug}`;
        return {
          title: post.title,
          description: post.autoExcerpt,
          pubDate: post.date,
          link: url,
          customData: `<guid isPermaLink="false">${escapeXml(url)}</guid>`,
          content,
        };
      }),
    );

    return rss({
      title,
      description,
      site: context.site ?? config.siteUrl,
      trailingSlash: false,
      xmlns: {
        dc: 'http://purl.org/dc/elements/1.1/',
        atom: 'http://www.w3.org/2005/Atom',
      },
      customData: `<generator>Astro</generator><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
      items,
    });
  };
};
