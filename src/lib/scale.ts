/**
 * The scale system.
 *
 * Every work sits in an identically sized box. How much of that box a work
 * fills is derived from its real size in millimetres, so a booklet reads as
 * small and a spread fills the box. The largest work on the site defines the
 * box: it sets how many screen pixels one millimetre is worth, and every other
 * work is measured with that same millimetre.
 */
import type { CollectionEntry } from 'astro:content';

/** Width in px that the widest work occupies. The box adds padding around it. */
const CONTENT_WIDTH = 570;

/** Breathing room between the largest work and the box edge, in px. */
const BOX_PADDING = 28;

/**
 * The page measure. Everything — header, boxes, captions, about text — shares
 * this width, so one left edge runs down the whole page.
 */
export const PAGE_WIDTH = CONTENT_WIDTH + BOX_PADDING * 2;

type Work = CollectionEntry<'works'>;
type Slide = Work['data']['images'][number];

/** Real size of a slide, falling back to the work's default. */
export function slideSize(work: Work['data'], slide: Slide) {
  return {
    w: slide.width_mm ?? work.width_mm,
    h: slide.height_mm ?? work.height_mm,
  };
}

/**
 * Derive the shared scale from the whole collection, so adding a larger work
 * rescales everything consistently instead of silently overflowing the box.
 *
 * Returns null when there is nothing to measure — with no works there are no
 * boxes to size, and inventing a millimetre would only hide the empty state.
 */
export function scaleFor(works: Work[]) {
  const sizes = works.flatMap((work) =>
    work.data.images.map((slide) => slideSize(work.data, slide))
  );
  if (sizes.length === 0) return null;

  // One millimetre, in px.
  const mm = CONTENT_WIDTH / Math.max(...sizes.map((s) => s.w));
  const tallest = Math.max(...sizes.map((s) => s.h));

  return { mm, boxH: Math.round(tallest * mm) + BOX_PADDING * 2 };
}

/**
 * Warn when a scan's own proportions disagree with the millimetres entered for
 * it — usually a typo, a swapped width/height, or an uncropped scan with white
 * margins. Display is never distorted; the object just isn't the size claimed.
 */
export function checkAspect(works: Work[], tolerance = 0.03) {
  for (const work of works) {
    work.data.images.forEach((slide, i) => {
      const { w, h } = slideSize(work.data, slide);
      const stated = w / h;
      const actual = slide.src.width / slide.src.height;
      const drift = Math.abs(actual - stated) / stated;

      if (drift > tolerance) {
        console.warn(
          `[scale] ${work.id} image ${i + 1}: stated ${w}×${h}mm is ${stated.toFixed(3)}, ` +
            `but the file is ${actual.toFixed(3)} — off by ${(drift * 100).toFixed(1)}%.`
        );
      }
    });
  }
}
