/**
 * The modular scale.
 *
 * One base size and one ratio drive type sizes, spacing, and the frame every
 * project sits in, so nothing on the page is sized arbitrarily.
 */
import type { CollectionEntry } from 'astro:content';

export const BASE = 16; // px
export const RATIO = 1.25;

/**
 * The page measure: header, frames, and captions all share this width — fixed
 * directly rather than derived from the scale (matches the brief prototype's
 * own .wrap max-width).
 */
export const PAGE_WIDTH = 560;

/**
 * Width : height of every project's frame. Fixed site-wide (see the brief) —
 * an A4 spread opened flat (420×300mm), so spreads (slide 2+) fill it edge to
 * edge instead of leaving letterbox slack on most works.
 */
export const FRAME_RATIO = 420 / 300;

/**
 * Pixels per millimetre for every cover, fixed and hand-tuned rather than
 * derived from the works in the collection. A cover renders at
 * width_mm/height_mm × this scale, letterboxed inside the frame — so two
 * covers whose real sizes differ by 2× render 2× apart on screen, and adding
 * a new work never changes how the existing ones look.
 */
export const MM_SCALE = 1.2;

type Work = CollectionEntry<'works'>;

/**
 * Warn when a cover's own proportions disagree with the millimetres entered
 * for it — usually a typo, a swapped width/height, or an uncropped scan with
 * white margins. Display is never distorted; the object just isn't the size
 * claimed. Only the cover (slide 1) claims a real size — spreads scale to fit
 * the frame regardless of their real dimensions.
 */
export function checkAspect(works: Work[], tolerance = 0.03) {
  for (const work of works) {
    const cover = work.data.images[0];
    if (!cover) continue;

    const stated = work.data.width_mm / work.data.height_mm;
    const actual = cover.src.width / cover.src.height;
    const drift = Math.abs(actual - stated) / stated;

    if (drift > tolerance) {
      console.warn(
        `[scale] ${work.id} cover: stated ${work.data.width_mm}×${work.data.height_mm}mm is ` +
          `${stated.toFixed(3)}, but the file is ${actual.toFixed(3)} — off by ${(drift * 100).toFixed(1)}%.`
      );
    }
  }
}
