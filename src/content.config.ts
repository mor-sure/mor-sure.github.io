import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      caption: z.string(),
      // Real size of the printed object, in millimetres. Drives how much of the
      // box the work fills. Spreads are measured opened flat.
      width_mm: z.number(),
      height_mm: z.number(),
      images: z
        .array(
          z.object({
            src: image(),
            alt: z.string().optional(),
            // Only needed when a slide differs from the work's default size —
            // e.g. a spread inside a work whose default is the cover.
            width_mm: z.number().optional(),
            height_mm: z.number().optional(),
          })
        )
        .min(1),
      order: z.number().default(0),
      draft: z.boolean().default(false),
    }),
});

export const collections = { works };
