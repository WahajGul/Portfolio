import { useRef } from "react";
import { m } from "framer-motion";
import { useSkills } from "../hooks/useSkills";
import { useReveal } from "../hooks/useReveal";
import {
  EASE_OUT,
  HEADING_DURATION,
  REVEAL_DURATION,
  REVEAL_STAGGER,
  headingWipe,
  revealRise,
} from "../lib/motion";
import { EmptyState } from "./states/EmptyState";
import { ErrorState } from "./states/ErrorState";
import styles from "./SkillsSection.module.css";

/** How many groups queue a stagger delay before the cap (DESIGN.md: max 4). */
const STAGGER_CAP = 4;

// Loading reserves the shape of the loaded block — four groups in the same two
// column grid — so the groups landing do not shove the page down. Flat fills
// only; nothing shimmers, because nothing loops.
const SkillsSkeleton = () => (
  <div className={styles.skeleton} aria-hidden="true">
    {[0, 1, 2, 3].map((group) => (
      <div className={styles.skeletonGroup} key={group}>
        <span className={`${styles.skelBar} ${styles.skelHeading}`} />
        <span className={styles.skelBar} />
      </div>
    ))}
  </div>
);

// Skills are a compact grouped list and nothing more: a group name and the
// tools in it. No bars, no stars, no icons, and no percentage of anything —
// there is no honest way to measure "80% of React", so the site does not claim
// one. Groups come from skills.json; adding one needs no code change.
export const SkillsSection = () => {
  const { data: groups, loading, error } = useSkills();
  const listRef = useRef<HTMLUListElement | null>(null);
  // The heading wipes in like every other section heading, on the same
  // visible-by-default contract as the groups below it.
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const headingReveal = useReveal(headingRef);
  // Visible by default; the block only drops into its pre-reveal state once the
  // motion chunk has resolved and only if it is still below the viewport then
  // (see hooks/useReveal.ts), so a blocked chunk still shows every group.
  const reveal = useReveal(listRef);
  const list = groups ?? [];

  return (
    <section id="skills" className="band" aria-labelledby="skills-heading" aria-busy={loading}>
      <div className="container">
        <m.h2
          id="skills-heading"
          ref={headingRef}
          className="section-heading"
          initial={false}
          animate={headingReveal}
          variants={headingWipe}
          transition={
            headingReveal === "hidden"
              ? { duration: 0 }
              : { clipPath: { duration: HEADING_DURATION, ease: EASE_OUT } }
          }
        >
          Skills
        </m.h2>

        {loading && <SkillsSkeleton />}
        {error !== null && <ErrorState />}

        {!loading && error === null && (
          <>
            {list.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className={styles.groups} ref={listRef}>
                {list.map((group, index) => {
                  const delay = Math.min(index, STAGGER_CAP) * REVEAL_STAGGER;

                  return (
                    <m.li
                      key={group.group}
                      className={styles.group}
                      // The group is laid out at its visible values from the first
                      // paint; stepping to "hidden" is instant and only ever
                      // happens below the fold.
                      initial={false}
                      animate={reveal}
                      variants={revealRise}
                      transition={
                        reveal === "hidden"
                          ? { duration: 0 }
                          : {
                              opacity: { duration: REVEAL_DURATION, ease: EASE_OUT, delay },
                              y: { duration: REVEAL_DURATION, ease: EASE_OUT, delay },
                            }
                      }
                    >
                      <h3 className={styles.groupName}>{group.group}</h3>
                      {/* One plain wrapped list per group, commas between items:
                          a real list for assistive tech, a short line on screen. */}
                      <ul className={styles.items}>
                        {group.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </m.li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
};
