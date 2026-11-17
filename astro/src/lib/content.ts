import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { format } from 'date-fns';
import { visit } from 'unist-util-visit';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkSmartypants from 'remark-smartypants';
import { unified } from 'unified';
import kebabCase from 'lodash.kebabcase';
import words from 'lodash.words';

import { getDateLocale, type Lang } from './i18n';

const images = import.meta.glob<ImageMetadata>(
  [
    '/src/content/img/**/*.{jpg,jpeg,png,gif,webp,avif}',
    '/src/content/avatars/**/*.{jpg,jpeg,png,gif,webp,avif}',
  ],
  { eager: true, import: 'default' },
);

export const resolveContentImage = (path?: string): ImageMetadata | undefined => {
  if (!path) {
    return undefined;
  }
  const normalized = path.replace(/^\.\.\//, '').replace(/^\.\//, '');
  return images[`/src/content/${normalized}`];
};

export interface AuthorData {
  id: string;
  name: string;
  bio: string;
  avatar: ImageMetadata;
  profileImage?: ImageMetadata;
  website?: string;
  twitter?: string;
  facebook?: string;
  location?: string;
}

export interface TagData {
  id: string;
  name: string;
  description?: string;
  image?: ImageMetadata;
}

export interface PostData {
  id: string;
  slug: string;
  lang: Lang;
  title: string;
  date: Date;
  datetime: string;
  displayDate: string;
  tags: string[];
  draft: boolean;
  excerpt: string;
  autoExcerpt: string;
  headerExcerpt: string;
  image?: ImageMetadata;
  authors: AuthorData[];
  timeToRead: number;
  translationKey?: string;
  body: string;
  entry: CollectionEntry<'postsIt' | 'postsEn'>;
}

const postCollection = (lang: Lang) => (lang === 'it' ? 'postsIt' : 'postsEn');

export const getAuthors = async (): Promise<AuthorData[]> => {
  const entries = await getCollection('authors');
  return entries.map(entry => ({
    id: entry.id,
    name: entry.data.name,
    bio: entry.data.bio ?? '',
    avatar: resolveContentImage(entry.data.avatar) as ImageMetadata,
    profileImage: resolveContentImage(entry.data.profile_image),
    website: entry.data.website,
    twitter: entry.data.twitter,
    facebook: entry.data.facebook,
    location: entry.data.location,
  }));
};

const excerptProcessor = unified().use(remarkParse).use(remarkGfm).use(remarkSmartypants);
const SPACE_NODES = new Set(['paragraph', 'heading', 'tableCell', 'break']);

const plainText = (body: string, includeCode: boolean): string => {
  const tree = excerptProcessor.runSync(excerptProcessor.parse(body));
  const parts: string[] = [];

  visit(tree, rawNode => {
    const node = rawNode as { type: string; value?: string; alt?: string };
    if (node.type === 'text' || node.type === 'inlineCode') {
      parts.push(node.value ?? '');
    } else if (includeCode && node.type === 'code') {
      parts.push(node.value ?? '');
    } else if (node.type === 'image') {
      parts.push(node.alt ?? '');
    } else if (SPACE_NODES.has(node.type)) {
      parts.push(' ');
    }
  });

  return parts.join('').trim();
};

const decodeEntities = (text: string): string =>
  text
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#x2F;/g, '/');

const readingMinutes = (html: string): number => {
  const text = decodeEntities(html.replace(/<[^>]+>/g, ' '));
  return Math.max(1, Math.round(words(text).length / 265));
};

const createExcerpt = (body: string): string => {
  const text = plainText(body, false);
  if (text.length <= 140) return text;

  const template = text
    .slice(0, 141)
    .replace(/.(?=\W*\w*$)/g, character =>
      character.toUpperCase() !== character.toLowerCase() ? 'A' : ' ',
    );

  const pruned = /\w\w/.test(template.slice(-2))
    ? template.replace(/\s*\S+$/, '')
    : template.slice(0, -1).replace(/\s+$/, '');

  return `${pruned + '…'}`.length > text.length
    ? text
    : `${text.slice(0, pruned.length)}…`;
};

const normalizePost = (
  entry: CollectionEntry<'postsIt' | 'postsEn'>,
  lang: Lang,
  authorsByName: Map<string, AuthorData>,
): PostData => {
  const data = entry.data;
  const date = data.date;
  const datetime = format(date, 'yyyy-MM-dd');
  const displayDate = format(date, 'dd LLL yyyy', { locale: getDateLocale(lang) });
  const body = entry.body ?? '';
  const autoExcerpt = createExcerpt(body);
  const authors = (data.author ?? [])
    .map(name => authorsByName.get(name))
    .filter((author): author is AuthorData => Boolean(author));

  return {
    id: entry.id,
    slug: `/${lang}/${entry.id}/`,
    lang,
    title: data.title,
    date,
    datetime,
    displayDate,
    tags: data.tags ?? [],
    draft: data.draft ?? false,
    autoExcerpt,
    headerExcerpt: data.excerpt ?? '',
    excerpt: data.excerpt ?? autoExcerpt,
    image: data.image,
    authors,
    timeToRead: entry.rendered?.html
      ? readingMinutes(entry.rendered.html)
      : Math.max(1, Math.round(words(plainText(body, true)).length / 265)),
    translationKey: data.translationKey,
    body,
    entry,
  };
};

export const getPosts = async (
  lang: Lang,
  options: { includeDrafts?: boolean } = {},
): Promise<PostData[]> => {
  const [entries, authors] = await Promise.all([
    getCollection(postCollection(lang)),
    getAuthors(),
  ]);
  const authorsByName = new Map(authors.map(author => [author.name, author]));

  return entries
    .filter(entry => options.includeDrafts || entry.data.draft !== true)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map(entry => normalizePost(entry, lang, authorsByName));
};

export const getPost = async (lang: Lang, slug: string): Promise<PostData | undefined> => {
  const posts = await getPosts(lang, { includeDrafts: true });
  return posts.find(post => post.id === slug);
};

export const getTranslations = async (): Promise<
  Record<string, Partial<Record<Lang, string>>>
> => {
  const [itPosts, enPosts] = await Promise.all([getPosts('it'), getPosts('en')]);
  const translations: Record<string, Partial<Record<Lang, string>>> = {};

  [...itPosts, ...enPosts].forEach(post => {
    if (!post.translationKey) {
      return;
    }
    translations[post.translationKey] ??= {};
    translations[post.translationKey][post.lang] = post.slug;
  });

  return translations;
};

export const getAdjacentPosts = async (lang: Lang, slug: string) => {
  const posts = await getPosts(lang);
  const ascending = [...posts].reverse();
  const index = ascending.findIndex(post => post.id === slug);

  return {
    prev: index > 0 ? ascending[index - 1] : undefined,
    next: index >= 0 && index < ascending.length - 1 ? ascending[index + 1] : undefined,
  };
};

export const getRelatedPosts = async (lang: Lang, primaryTag: string) => {
  if (!primaryTag) {
    return { totalCount: 0, posts: [] as PostData[] };
  }

  const posts = await getPosts(lang);
  const related = posts.filter(post => post.tags.includes(primaryTag));

  return {
    totalCount: related.length,
    posts: related.slice(0, 5),
  };
};

export const getTags = async (lang: Lang): Promise<TagData[]> => {
  const entries = await getCollection(lang === 'it' ? 'tagsIt' : 'tagsEn');

  return entries.map(entry => ({
    id: entry.id,
    name: entry.data.name,
    description: entry.data.description,
    image: resolveContentImage(entry.data.image),
  }));
};

export const getTagPaths = async (lang: Lang) => {
  const posts = await getPosts(lang);
  const tags = [...new Set(posts.flatMap(post => post.tags))];

  return tags.map(tag => ({
    tag,
    slug: kebabCase(tag),
  }));
};

export const getAuthorPaths = async () => {
  const authors = await getAuthors();

  return authors.map(author => ({
    author: author.name,
    slug: kebabCase(author.name),
  }));
};

export { kebabCase };
