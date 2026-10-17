import { useEffect, useLayoutEffect, useRef } from "react";
import { m, useReducedMotion } from "framer-motion";
import { Play, X } from "lucide-react";
import { imageSources, PHONE_MEDIA } from "../lib/images";
import { shotLayoutId, titleLayoutId } from "../lib/motion";
import type { Project } from "../types";
import styles from "./ProjectDetail.module.css";

/** The panel is capped at 48rem, so the largest slot it can need is 768px. */
const SIZES_PANEL = "768px";

interface ProjectDetailProps {
  project: Project;
  /** The control that opened the panel; focus returns here on close. */
  trigger: HTMLElement | null;
  onClose: () => void;
}

/*
 * The detail panel: a native <dialog>, so the browser supplies the top layer,
 * the modality, the focus trap, Escape, and the ::backdrop. This wrapper adds
 * only what the element does not do itself — the scroll lock, the focus return,
 * and a backdrop click — plus the shared-element morph layered on top.
 */
export const ProjectDetail = ({ project, trigger, onClose }: ProjectDetailProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const reducedMotion = useReducedMotion() ?? false;

  // showModal in a layout effect, so the dialog is already in the top layer in
  // the frame the panel first renders: no flash of an unopened dialog.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (dialog !== null && !dialog.open) dialog.showModal();
  }, []);

  // Scroll lock, restored on unmount. The page behind a modal is inert, but it
  // can still scroll, and a native dialog does not stop it.
  useEffect(() => {
    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = documentElement.style.overflow;
    const previousPadding = body.style.paddingRight;

    // Hiding the scrollbar would shift the whole page: hold its width instead.
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousHtmlOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, []);

  const shot = imageSources(project, "image");
  const mobileShot = imageSources(project, "imageMobile");
  // Reduced motion skips the shared-element morph: the panel simply appears.
  const canShare = !reducedMotion;

  // Escape closes the dialog natively, and this one handler covers every path
  // (Escape, the close button, a backdrop click) because they all end in
  // close(). Focus is handed back exactly once.
  const handleClose = (): void => {
    if (trigger !== null && trigger.isConnected) trigger.focus();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={`${project.id}-detail-title`}
      onClose={handleClose}
      onClick={(event) => {
        // A click that lands on the dialog itself, rather than inside the
        // sheet, is a backdrop click. On phones the sheet covers the dialog, so
        // this can only happen from 768px up.
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}
    >
      <div className={styles.sheet}>
        <div className={styles.bar}>
          <button
            type="button"
            className={styles.close}
            onClick={() => dialogRef.current?.close()}
          >
            <X aria-hidden="true" size={20} />
            <span className="visually-hidden">Close</span>
          </button>
        </div>

        {shot !== null && (
          <picture>
            {/* The same phone set as the plate, so opening the panel never
                pulls a candidate the plate had not already asked for. */}
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
              sizes={SIZES_PANEL}
              width={1200}
              height={750}
              alt={shot.alt}
              decoding="async"
            />
          </picture>
        )}

        <m.h2
          id={`${project.id}-detail-title`}
          className={styles.title}
          layoutId={canShare ? titleLayoutId(project.id) : undefined}
        >
          {project.title}
        </m.h2>

        <p
          className={`${styles.status} ${project.status === "live" ? styles.statusLive : styles.statusQuiet}`}
        >
          {project.status}
        </p>

        <ul className={styles.stack}>
          {project.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <p className={styles.description}>{project.description}</p>

        {project.highlights !== undefined && project.highlights.length > 0 && (
          <ul className={styles.highlights}>
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        )}

        {project.demo !== undefined && (
          <a className={styles.demo} href={project.demo} target="_blank" rel="noreferrer">
            <Play aria-hidden="true" size={16} />
            Play demo
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        )}
      </div>
    </dialog>
  );
};
