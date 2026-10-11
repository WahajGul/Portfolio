import type { Transition, Variants } from "framer-motion";

/*
 * Shared Framer Motion values. This is the JS mirror of the motion tokens in
 * tokens.css: framer-motion transition configs cannot read CSS custom
 * properties, so each value here names the token it mirrors.
 */

/* --ease-out: cubic-bezier(0.22, 1, 0.36, 1) */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* --duration-signature (400ms) and --stagger (90ms) */
export const SIGNATURE_DURATION = 0.4;
export const SIGNATURE_STAGGER = 0.09;

// Signature moment: a clip-path inset wipe from left to right with a 12px
// rise. Only clip-path and transform animate; the text sits in the DOM from
// the first render, so assistive tech reads it regardless of the wipe.
export const wipeRise: Variants = {
  hidden: { clipPath: "inset(0% 100% 0% 0%)", y: 12 },
  visible: { clipPath: "inset(0% 0% 0% 0%)", y: 0 },
};

export const signatureTransition: Transition = {
  duration: SIGNATURE_DURATION,
  ease: EASE_OUT,
};
