import type { Variants } from "framer-motion";

/*
 * Shared Framer Motion values. This is the JS mirror of the motion tokens in
 * tokens.css: framer-motion transition configs cannot read CSS custom
 * properties, so each value here names the token it mirrors.
 *
 * The hero signature moment is deliberately absent: it is a CSS keyframe
 * animation in Hero.module.css, so the first screen never needs this library.
 * Everything in this file runs only once the lazy domMax chunk has resolved.
 */

/* --ease-out: cubic-bezier(0.22, 1, 0.36, 1) */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* --duration-reveal (300ms), --duration-fast (200ms). The reveal stagger is
   lighter than the hero's 90ms and exists only here: CSS never drives it, so
   tokens.css does not carry the value. */
export const REVEAL_DURATION = 0.3;
export const FAST_DURATION = 0.2;
export const REVEAL_STAGGER = 0.05;

/* The More-projects rows mount on a click, never on the first paint, so their
   stagger is lighter still (40ms, capped by the row's own index) and their
   fade is DESIGN.md's P5 250ms rather than the 300ms reveal. */
export const ROW_STAGGER = 0.04;
export const ROW_DURATION = 0.25;

/* Shared-element ids. The plate and the detail panel hand the screenshot and the
   title to each other through Framer's layoutId, so both sides must spell these
   exactly the same way. */
export const shotLayoutId = (projectId: string): string => `project-${projectId}-shot`;
export const titleLayoutId = (projectId: string): string => `project-${projectId}-title`;

/* The two ends of a reveal. "hidden" is applied by Framer only once the motion
   chunk is ready and only to elements still below the viewport (see
   hooks/useReveal.ts), so nothing is ever blank while the library loads. Only
   opacity and transform animate. */
export const revealRise: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

/* --duration-signature (400ms): the heading wipe is the same length as one step
   of the hero's entrance. */
export const HEADING_DURATION = 0.4;

/* A section heading wipes in left to right and nothing else moves: the reveal
   underneath it carries the rise, so the two never look like one gesture. Only
   clip-path animates, and the hidden end is applied through useReveal, never in
   the base CSS. */
export const headingWipe: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: { clipPath: "inset(0 0 0 0)" },
};
