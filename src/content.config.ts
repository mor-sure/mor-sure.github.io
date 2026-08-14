import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  // Two unrelated shapes of "work": a physical print piece (a frame'd
  // carousel, sized to its real proportions) and an online piece (a single
  // link-out card, no real-world size to speak of). A discriminated union
  // keeps each shape's fields — and the components that render them — from
  // having to account for fields that only make sense for the other kind.
  schema: ({ image }) =>
    z.discriminatedUnion('type', [
      z.object({
        type: z.literal('print'),
        title: z.string(),
        // 'YYYY-MM' from Decap's date widget — sorted as a string, which
        // works fine for this fixed-width, zero-padded format.
        date: z.string(),
        caption: z.string(),
        // Real size of the cover (slide 1), in millimetres — sets its aspect
        // ratio inside the frame. Spreads (slide 2+) scale to fit the frame
        // regardless of their real size, so they carry no dimensions of
        // their own.
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
        caption: z.string(),
        // Where the "Online" tag links out to.
        url: z.string().url(),
        image: image(),
        alt: z.string().optional(),
        order: z.number().default(0),
        draft: z.boolean().default(false),
      }),
    ]),
});

export const collections = { works };
