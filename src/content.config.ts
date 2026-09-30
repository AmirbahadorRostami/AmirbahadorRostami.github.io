import { defineCollection, type ImageFunction } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const nonemptyString = z.string().trim().min(1);
const positiveOrder = z.number().int().positive();
const aspectRatio = z.string().regex(/^\d+\s*\/\s*\d+$/);
const httpsUrl = z.url().refine((value) => new URL(value).protocol === 'https:', {
  message: 'External URLs must use HTTPS.',
});
const externalLink = z.object({
  label: nonemptyString,
  url: httpsUrl,
});
const mediaSource = z.object({
  src: nonemptyString,
  type: z.enum(['video/mp4', 'video/webm']),
});
const projectMedia = ({ image }: { image: ImageFunction }) => z.object({
  id: nonemptyString,
  type: z.enum(['image', 'video', 'diagram']),
  intention: nonemptyString,
  aspectRatio,
  alt: nonemptyString,
  caption: nonemptyString,
  state: z.enum(['ready', 'placeholder']),
  image: image().optional(),
  poster: image().optional(),
  sources: z.array(mediaSource).default([]),
  externalUrl: httpsUrl.optional(),
}).superRefine((media, context) => {
  if (media.state === 'ready' && media.type === 'image' && !media.image) {
    context.addIssue({ code: 'custom', message: 'Ready image media requires image.' });
  }
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
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
    hero: image(),
    heroAlt: nonemptyString,
    detailHero: image().optional(),
    detailHeroAlt: nonemptyString.optional(),
    detailHeroMark: image().optional(),
    context: nonemptyString.optional(),
    collaborators: z.array(nonemptyString).default([]),
    credits: z.array(nonemptyString).default([]),
    externalLinks: z.array(externalLink).default([]),
    media: z.array(projectMedia({ image })).min(1),
    liveExperiment: z.boolean().default(false),
    outcomes: z.array(nonemptyString).default([]),
    draft: z.boolean().default(false),
  }),
});

const experiments = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/experiments' }),
  schema: ({ image }) => z.object({
    title: nonemptyString.optional(),
    order: positiveOrder,
    state: z.enum(['ready', 'placeholder']),
    description: nonemptyString.optional(),
    processNotes: nonemptyString.optional(),
    sourceUrl: httpsUrl.optional(),
    sourceLabel: nonemptyString.optional(),
    poster: image().optional(),
    sources: z.array(mediaSource).default([]),
  }),
});

const music = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/music' }),
  schema: z.object({
    title: nonemptyString,
    platform: z.enum(['spotify', 'soundcloud', 'bandcamp', 'direct']),
    url: httpsUrl,
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

export const collections = { projects, experiments, music, experience };
