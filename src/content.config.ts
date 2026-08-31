import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const nonemptyString = z.string().trim().min(1);
const positiveOrder = z.number().int().positive();
const externalLink = z.object({
  label: nonemptyString,
  url: z.url(),
});
const video = z.object({
  title: nonemptyString,
  url: z.url(),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: nonemptyString,
    alternateTitle: nonemptyString.optional(),
    year: nonemptyString.optional(),
    summary: nonemptyString,
    cardSummary: nonemptyString,
    depth: z.enum(['flagship', 'short']),
    order: positiveOrder,
    featured: z.boolean().default(false),
    categories: z.array(nonemptyString).min(1),
    roles: z.array(nonemptyString).min(1),
    tools: z.array(nonemptyString).min(1),
    hero: nonemptyString,
    heroAlt: nonemptyString,
    context: nonemptyString.optional(),
    collaborators: z.array(nonemptyString).default([]),
    credits: z.array(nonemptyString).default([]),
    externalLinks: z.array(externalLink).default([]),
    videos: z.array(video).default([]),
    liveExperiment: z.boolean().default(false),
    outcomes: z.array(nonemptyString).default([]),
    draft: z.boolean().default(false),
  }),
});

const music = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/music' }),
  schema: z.object({
    title: nonemptyString,
    platform: z.enum(['spotify', 'soundcloud', 'bandcamp', 'direct']),
    url: z.url(),
    order: positiveOrder,
    featured: z.boolean().default(false),
    duration: nonemptyString.optional(),
    description: nonemptyString.optional(),
    draft: z.boolean().default(false),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/experience' }),
  schema: z.object({
    role: nonemptyString,
    organization: nonemptyString,
    period: nonemptyString,
    order: positiveOrder,
    summary: nonemptyString,
    category: z.enum([
      'engineering',
      'creative-technology',
      'research',
      'teaching',
      'education',
    ]),
    featured: z.boolean().default(false),
  }),
});

export const collections = { projects, music, experience };
