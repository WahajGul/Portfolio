import { m, useReducedMotion } from "framer-motion";
import { getProfile } from "../api";
import { useAsync } from "../hooks/useAsync";
import { SIGNATURE_STAGGER, signatureTransition, wipeRise } from "../lib/motion";
import { ErrorState } from "./states/ErrorState";
import { Loading } from "./states/Loading";
import styles from "./Hero.module.css";

export const Hero = () => {
  const { data: profile, loading, error } = useAsync(getProfile);
  const reducedMotion = useReducedMotion() ?? false;

  // Signature moment, once on mount: name (0ms), headline (90ms), learning
  // line (180ms) — three 400ms wipes, complete at 580ms. The looking-for line
  // rides with the headline step. The text is in the DOM before any of this,
  // so assistive tech and search never wait on the wipe. Under reduced motion
  // initial=false renders every line already in its final state: no wipe, no
  // rise, no delay.
  const step = (index: number) => ({
    initial: reducedMotion ? false : ("hidden" as const),
    animate: "visible" as const,
    variants: wipeRise,
    transition: { ...signatureTransition, delay: SIGNATURE_STAGGER * index },
  });

  return (
    <section id="hero" className={styles.hero} aria-label="Introduction">
      {loading && <Loading />}
      {error !== null && <ErrorState />}
      {!loading && error === null && profile !== null && (
        <>
          <m.h1 className={styles.name} {...step(0)}>
            {profile.name}
          </m.h1>
          <m.p className={styles.headline} {...step(1)}>
            {profile.headline}
          </m.p>
          <m.p {...step(1)}>{profile.lookingFor}</m.p>
          {profile.currentlyLearning !== undefined && (
            <m.p className={styles.learning} {...step(2)}>
              Currently learning: {profile.currentlyLearning}
            </m.p>
          )}
          <div className={styles.actions}>
            <a className={`${styles.button} ${styles.primary}`} href="#projects">
              View projects
            </a>
            <a className={`${styles.button} ${styles.secondary}`} href="#contact">
              Contact
            </a>
            {profile.resumeUrl !== undefined && (
              <a
                className={`${styles.button} ${styles.secondary}`}
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
              >
                Resume
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </>
      )}
    </section>
  );
};
