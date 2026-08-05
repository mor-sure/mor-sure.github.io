import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      caption: z.string(),
      // Real size of the cover (slide 1), in millimetres — sets its aspect
      // ratio inside the frame. Spreads (slide 2+) scale to fit the frame
      // regardless of their real size, so they carry no dimensions of their own.
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
});

export const collections = { works };
