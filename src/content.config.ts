import { defineCollection, type ImageFunction } from 'astro:content';
import { z } from 'astro/zod';
import { file, glob } from 'astro/loaders';

const postSchema = ({ image }: { image: ImageFunction }) =>
  z.object({
    layout: z.string().optional(),
    translationKey: z.string().optional(),
    title: z.string(),
    image: image().optional(),
    author: z.array(z.string()).default(['Mattia Natali']),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    excerpt: z.string().optional(),
  });

const postsIt = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/it' }),
  schema: postSchema,
});

const postsEn = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/en' }),
  schema: postSchema,
});

const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
  lang: z.enum(['it', 'en']),
  translationKey: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
});

const tagsIt = defineCollection({
  loader: file('src/content/it/tag.yaml'),
  schema: tagSchema,
});

const tagsEn = defineCollection({
  loader: file('src/content/en/tag.yaml'),
  schema: tagSchema,
});

const authorSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
  bio: z.string().optional().default(''),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  website: z.string().optional(),
  location: z.string().optional(),
  profile_image: z.string().optional(),
});

const authors = defineCollection({
  loader: file('src/content/author.yaml'),
  schema: authorSchema,
});

export const collections = {
  postsIt,
  postsEn,
  tagsIt,
  tagsEn,
  authors,
};
