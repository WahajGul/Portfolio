import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import { useMotionReady } from "./useMotionReady";

/** The two ends of a reveal, matching the `revealRise` variants. */
export type RevealState = "hidden" | "visible";

/**
 * The reveal contract from DESIGN.md and AGENTS.md, in one place:
 *
 * - Content is visible by default. Nothing in the base stylesheet hides it.
 * - The hidden pre-reveal state is applied only once the motion chunk is ready
 *   AND only to an element that is still below the viewport at that moment, so
 *   nothing already on screen ever blinks out.
 * - An element already on screen at that moment stays visible and simply does
 *   not animate; everything else reveals on intersection and never re-hides.
 * - Reduced motion skips the pre-reveal state entirely.
 *
 * IntersectionObserver only: no scroll listeners, no layout work in a scroll
 * path, and the observer disconnects the first time it fires.
 */
export const useReveal = <T extends Element>(
  ref: RefObject<T | null>,
): RevealState => {
  const motionReady = useMotionReady();
  const reducedMotion = useReducedMotion() ?? false;
  const [awaiting, setAwaiting] = useState(false);
  const [seen, setSeen] = useState(false);

  // A layout effect, so the decision lands before the browser paints the frame
  // in which the motion chunk arrived: no flash of content jumping states.
  useLayoutEffect(() => {
    if (!motionReady || reducedMotion || awaiting) return;

    const element = ref.current;
    if (element === null) return;

    // Rows mounted after the chunk landed decide immediately too: on screen
    // stays visible, below the fold gets the pre-reveal state.
    if (element.getBoundingClientRect().top <= window.innerHeight) return;

    setAwaiting(true);
  }, [awaiting, motionReady, reducedMotion, ref]);

  useEffect(() => {
    if (!awaiting || seen) return;

    const element = ref.current;
    if (element === null) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [awaiting, ref, seen]);

  return awaiting && !seen ? "hidden" : "visible";
};
