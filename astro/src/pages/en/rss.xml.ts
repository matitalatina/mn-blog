import rss from '@astrojs/rss';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { render } from 'astro:content';
import type { APIContext } from 'astro';
import config from '../../website-config';
import { getPosts } from '../../lib/content';

export async function GET(context: APIContext) {
  const posts = await getPosts('en');
  const container = await AstroContainer.create();
  const site = config.siteUrl.replace(/\/$/, '');
  const items = await Promise.all(
    posts.map(async post => {
      const { Content } = await render(post.entry);
      const content = await container.renderToString(Content);
      return {
        title: post.title,
        description: post.autoExcerpt,
        pubDate: post.date,
        link: `${site}${post.slug}`,
        customData: `<guid isPermaLink="false">${site}${post.slug}</guid>`,
        content,
      };
    }),
  );

  return rss({
    title: "Mattia Natali's Blog",
    description: 'My technical personal blog',
    site: context.site ?? config.siteUrl,
    trailingSlash: false,
    xmlns: {
      dc: 'http://purl.org/dc/elements/1.1/',
      atom: 'http://www.w3.org/2005/Atom',
    },
    customData: `<generator>GatsbyJS</generator><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    items,
  });
}
