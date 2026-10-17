import type { Project } from "../types";

/*
 * Screenshot URLs. The data stores one `{w}` URL template per image, so a
 * component can build the width candidates that scripts/build-images.mjs
 * actually writes. A plain URL stays a single `src`: candidates are never
 * invented for a file that does not exist.
 */

/** Widths the build script writes, and the only values `{w}` expands to. */
export const IMAGE_WIDTHS = [480, 768, 1200] as const;

/** The one media condition that switches the picture element to its phone set. */
export const PHONE_MEDIA = "(max-width: 767px)";

/**
 * The phone cap, and the whole point of the `<source media="(max-width: 767px)">`
 * elements that use it: `sizes` is multiplied by the device pixel ratio, so a
 * `100vw` slot on a DPR-3 phone asks for ~1170 device pixels and takes the 1200w
 * file. Offering a phone only the 480w and 768w candidates stops it there — the
 * deliberate trade recorded in DESIGN.md (page weight), in exchange for a ~1.4x
 * upscale on the sharpest screens.
 */
export const PHONE_WIDTHS = IMAGE_WIDTHS.slice(0, 2);

/** The largest candidate, used as the plain `src` fallback. */
const LARGEST_WIDTH = 1200;

export interface ImageSources {
  src: string;
  /** Every candidate the build script writes. */
  srcSet?: string;
  /** Phones only: the capped list above. */
  phoneSrcSet?: string;
  /** Always present: an image with no authored alt text is never rendered. */
  alt: string;
}

const candidates = (template: string, widths: readonly number[]): string =>
  widths.map((width) => `${template.replace("{w}", String(width))} ${width}w`).join(", ");

export const imageSources = (
  project: Project,
  field: "image" | "imageMobile",
): ImageSources | null => {
  const template = field === "image" ? project.image : project.imageMobile;
  const alt = project.imageAlt;

  // Second line of defence for alt text: the guard in api/index.ts has already
  // stripped an image with no imageAlt, and this keeps any future data source
  // (Phase 3 network responses) from rendering an unnamed image as well.
  if (template === undefined || alt === undefined) return null;

  if (!template.includes("{w}")) return { src: template, alt };

  return {
    src: template.replace("{w}", String(LARGEST_WIDTH)),
    srcSet: candidates(template, IMAGE_WIDTHS),
    phoneSrcSet: candidates(template, PHONE_WIDTHS),
    alt,
  };
};
