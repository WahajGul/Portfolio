import { useRef, type RefCallback, type RefObject } from "react";
import { m, useReducedMotion } from "framer-motion";
import { useMotionReady } from "../hooks/useMotionReady";
import { useReveal } from "../hooks/useReveal";
import { imageSources, PHONE_MEDIA } from "../lib/images";
import {
  EASE_OUT,
  FAST_DURATION,
  REVEAL_DURATION,
  REVEAL_STAGGER,
  ROW_DURATION,
  ROW_STAGGER,
  revealRise,
  shotLayoutId,
  titleLayoutId,
} from "../lib/motion";
import type { Project, ProjectStatus } from "../types";
import styles from "./ProjectRow.module.css";

/** Where a plate sits in the visible set. Computed by ProjectsSection. */
export type PlateSpan = "full" | "half";

/** How many list positions queue a stagger delay before the cap. */
const STAGGER_CAP = 4;

/*
 * `sizes` mirrors the layout from 768px up: a full-span plate is the container
 * and a half-span plate is half of it. Below 768px the picture element takes
 * over and offers only the capped phone candidates (see lib/images.ts), so no
 * `sizes` value is needed there.
 */
const SIZES_FULL = "(min-width: 1088px) 1024px, 100vw";
const SIZES_HALF = "(min-width: 1088px) 496px, 50vw";

interface ProjectRowProps {
  project: Project;
  /** "plate" is a bordered grid cell; "row" is an image-free expander row. */
  variant?: "plate" | "row";
  /** Only the lead plate carries the larger title. Plates only. */
  lead?: boolean;
  /** Grid span for this plate, recomputed for the visible set. Plates only. */
  span?: PlateSpan;
  /** Position in its list, for the reveal stagger. */
  index?: number;
  /**
   * Opens the detail panel and receives the control that focus should return to
   * on close, so every route in ends at the plate's Details button. Plates only.
   */
  onOpen?: (project: Project, trigger: HTMLElement | null) => void;
  /**
   * AnimatePresence's popLayout mode needs the DOM node of a plate it is about
   * to take out of flow, and React hands that ref in as a plain prop. It always
   * passes a callback ref, so only callbacks are accepted here.
   */
  ref?: RefCallback<HTMLElement | null>;
}

// Status and stack are separate lines, never one combined string, and the
// word always carries the information — color is the second channel only.
const Status = ({ status }: { status: ProjectStatus }) => (
  <p
    className={`${styles.status} ${status === "live" ? styles.statusLive : styles.statusQuiet}`}
  >
    {status}
  </p>
);

const Stack = ({ items }: { items: string[] }) => (
  <ul className={styles.stack}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

/*
 * The plate's action row. `Details` is the single accessible trigger for the
 * panel — a real, visible, focusable button on every plate, named after its
 * project so a screen reader hears "SMDB Movie APP details" rather than six
 * identical "Details". Missing optional fields simply do not render: no empty
 * gaps, no dead buttons.
 */
const Actions = ({
  project,
  detailsRef,
  onOpen,
}: {
  project: Project;
  detailsRef?: RefObject<HTMLButtonElement | null>;
  onOpen?: (project: Project, trigger: HTMLElement | null) => void;
}) => {
  const hasLinks = project.live !== undefined || project.repo !== undefined;
  if (!hasLinks && (detailsRef === undefined || onOpen === undefined)) return null;

  return (
    <div className={styles.links}>
      {detailsRef !== undefined && onOpen !== undefined && (
        <button
          ref={detailsRef}
          type="button"
          className={`${styles.link} ${styles.details}`}
          aria-label={`${project.title} details`}
          onClick={() => onOpen(project, detailsRef.current)}
        >
          Details
        </button>
      )}
      {project.live !== undefined && (
        <a className={styles.link} href={project.live} target="_blank" rel="noreferrer">
          View project
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      )}
      {project.repo !== undefined && (
        <a className={styles.link} href={project.repo} target="_blank" rel="noreferrer">
          Code
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      )}
    </div>
  );
};

// A grid plate: bordered, radius 0, no shadow, with the proof in the order the
// eye scans it — screenshot, title, status, stack, description, links. The lead
// plate is the only larger one.
const Plate = ({
  project,
  lead,
  span,
  index,
  onOpen,
  forwardedRef,
}: {
  project: Project;
  lead: boolean;
  span: PlateSpan;
  index: number;
  onOpen: ((project: Project, trigger: HTMLElement | null) => void) | undefined;
  forwardedRef: RefCallback<HTMLElement | null> | undefined;
}) => {
  const reducedMotion = useReducedMotion() ?? false;
  const plateRef = useRef<HTMLElement | null>(null);
  // The one focusable trigger. A click on the screenshot also opens the panel,
  // but focus comes back here either way, so the keyboard never lands on a
  // control that assistive tech cannot see.
  const detailsRef = useRef<HTMLButtonElement | null>(null);
  // Visible by default; a below-the-fold plate only drops into its pre-reveal
  // state once the motion chunk has resolved (see hooks/useReveal.ts).
  const reveal = useReveal(plateRef);

  // One callback for both consumers of the node: useReveal measures the element
  // itself, and popLayout measures the one it pops out of flow.
  const setNode = (node: HTMLElement | null): void => {
    plateRef.current = node;
    if (forwardedRef !== undefined) forwardedRef(node);
  };

  const shot = imageSources(project, "image");
  const mobileShot = imageSources(project, "imageMobile");
  const sizes = span === "full" ? SIZES_FULL : SIZES_HALF;
  const revealDelay = Math.min(index, STAGGER_CAP) * REVEAL_STAGGER;
  // Reduced motion skips the shared-element hand-off entirely: the panel simply
  // appears, already complete.
  const canShare = !reducedMotion;

  const picture =
    shot === null ? null : (
      <picture>
        {/* Phones take the phone-shaped shot when there is one, and then the
            capped candidate list: below 768px the 1200w file is never asked
            for, which is the difference between a 565 KB grid scrolled and an
            880 KB one (DESIGN.md, page weight). */}
        {mobileShot !== null && mobileShot.phoneSrcSet !== undefined && (
          <source media={PHONE_MEDIA} srcSet={mobileShot.phoneSrcSet} sizes="100vw" />
        )}
        {shot.phoneSrcSet !== undefined && (
          <source media={PHONE_MEDIA} srcSet={shot.phoneSrcSet} sizes="100vw" />
        )}
        <m.img
          className={styles.shot}
          layoutId={canShare ? shotLayoutId(project.id) : undefined}
          src={shot.src}
          srcSet={shot.srcSet}
          sizes={sizes}
          width={1200}
          height={750}
          alt={shot.alt}
          loading="lazy"
          decoding="async"
        />
      </picture>
    );

  return (
    <m.article
      ref={setNode}
      // Span classes are inert on a phone, where the grid is one column.
      className={`${styles.plate} ${span === "full" ? styles.spanFull : styles.spanHalf}`}
      // Position only: plates reflow through projection, never a size tween.
      layout={reducedMotion ? false : "position"}
      // initial=false plus a controlled animate target: the plate is laid out at
      // its visible values from the first paint, so a missing motion chunk
      // leaves a complete page rather than an invisible one. Stepping to
      // "hidden" is instant — it only ever happens below the fold.
      initial={false}
      animate={reveal}
      variants={revealRise}
      exit={{ opacity: 0, transition: { duration: FAST_DURATION } }}
      transition={
        reveal === "hidden"
          ? { duration: 0 }
          : {
              layout: { duration: FAST_DURATION, ease: EASE_OUT },
              opacity: { duration: REVEAL_DURATION, ease: EASE_OUT, delay: revealDelay },
              y: { duration: REVEAL_DURATION, ease: EASE_OUT, delay: revealDelay },
            }
      }
    >
      {picture !== null && (
        <div className={styles.shotWrap}>
          {picture}
          {/* A pointer-only shortcut over the screenshot. No tab stop, no
              accessible name, nothing announced: the Details button below is
              the one route a keyboard or screen reader takes. */}
          {onOpen !== undefined && (
            <button
              type="button"
              className={styles.shotHit}
              tabIndex={-1}
              aria-hidden="true"
              onClick={() => onOpen(project, detailsRef.current)}
            />
          )}
        </div>
      )}

      <m.h3
        className={lead ? styles.titleLead : styles.title}
        layoutId={canShare ? titleLayoutId(project.id) : undefined}
      >
        {project.title}
      </m.h3>

      <Status status={project.status} />
      <Stack items={project.stack} />
      <p className={styles.description}>{project.description}</p>
      <Actions project={project} detailsRef={detailsRef} onOpen={onOpen} />
    </m.article>
  );
};

// A compact expander row: no image, no panel — the links are the route out. The
// rows mount only after a click, so fading in cannot blank the first screen.
const CompactRow = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => {
  const reducedMotion = useReducedMotion() ?? false;
  const motionReady = useMotionReady();
  const delay = Math.min(index, STAGGER_CAP) * ROW_STAGGER;

  return (
    <m.article
      className={styles.row}
      initial={motionReady && !reducedMotion ? "hidden" : false}
      animate="visible"
      variants={revealRise}
      transition={{
        opacity: { duration: ROW_DURATION, ease: EASE_OUT, delay },
        y: { duration: ROW_DURATION, ease: EASE_OUT, delay },
      }}
    >
      <div className={styles.rowHead}>
        <h3 className={styles.title}>{project.title}</h3>
        <Status status={project.status} />
      </div>
      <Stack items={project.stack} />
      {/* One line only: the expander is a list, not a second reading surface. */}
      <p className={styles.rowDescription}>{project.description}</p>
      <Actions project={project} />
    </m.article>
  );
};

export const ProjectRow = ({
  project,
  variant = "plate",
  lead = false,
  span = "full",
  index = 0,
  onOpen,
  ref,
}: ProjectRowProps) =>
  variant === "row" ? (
    <CompactRow project={project} index={index} />
  ) : (
    <Plate
      project={project}
      lead={lead}
      span={span}
      index={index}
      onOpen={onOpen}
      forwardedRef={ref}
    />
  );
