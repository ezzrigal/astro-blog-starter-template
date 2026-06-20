/**
 * src/content.config.ts
 * Content collections — blog, services, faq
 * services and faq are now managed via Decap CMS
 */
import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

// ── Blog posts ─────────────────────────────────────────────────
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    pubDate:     z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage:   z.string().optional(),
  }),
});

// ── Services ───────────────────────────────────────────────────
const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: '**/*.md' }),
  schema: z.object({
    title:       z.string(),
    icon:        z.string().optional(),
    description: z.string(),
    order:       z.number().default(1),
    active:      z.boolean().default(true),
  }),
});

// ── FAQ items ──────────────────────────────────────────────────
const faq = defineCollection({
  loader: glob({ base: './src/content/faq', pattern: '**/*.md' }),
  schema: z.object({
    question: z.string(),
    answer:   z.string(),
    order:    z.number().default(1),
  }),
});

export const collections = { blog, services, faq };
