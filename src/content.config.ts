import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: ({ image }) =>
    z.discriminatedUnion('type', [
      z.object({
        type: z.literal('print'),
        title: z.string(),
        date: z.string(),
        caption: z.string(),
        width_mm: z.number(),
        height_mm: z.number(),
        images: z
          .array(
            z.object({
              src: image(),
              alt: z.string().optional(),
            })
          )
          .min(1),
        order: z.number().default(0),
        draft: z.boolean().default(false),
      }),
      z.object({
        type: z.literal('online'),
        title: z.string(),
        date: z.string(),
        url: z.string().url(),
        caption: z.string().optional(),
        image: image().optional(),
        alt: z.string().optional(),
        order: z.number().default(0),
        draft: z.boolean().default(false),
      }),
    z.object({
  type: z.literal('event'),
  title: z.string(),
  date: z.string(),
  caption: z.string(),
  width_mm: z.number(),
  height_mm: z.number(),
  event_images: z
    .array(
      z.object({
        src: image(),
        alt: z.string().optional(),
        credit: z.string().optional(),
      })
    )
    .min(1),
  order: z.number().default(0),
  draft: z.boolean().default(false),
}),
      z.object({
        type: z.literal('record'),
        title: z.string(),
        date: z.string(),
        caption: z.string(),
        width_mm: z.number(),
        height_mm: z.number(),
        images: z
          .array(
            z.object({
              src: image(),
              alt: z.string().optional(),
            })
          )
          .length(2),
        order: z.number().default(0),
        draft: z.boolean().default(false),
      }),
    ]),
});

export const collections = { works };
