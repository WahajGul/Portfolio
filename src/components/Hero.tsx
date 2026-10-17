import { getProfile } from "../api";
import { useAsync } from "../hooks/useAsync";
import { ErrorState } from "./states/ErrorState";
import { Loading } from "./states/Loading";
import styles from "./Hero.module.css";

// The signature moment is CSS keyframes (Hero.module.css), not Framer Motion:
// the first screen renders and animates with no motion JavaScript at all. The
// order is name (0ms), headline and looking-for line (90ms), learning line
// (180ms) — three 400ms wipes, 12px rise, complete at 580ms, once on load.
// The text is in the DOM from the first paint, so assistive tech and search
// never wait on the wipe, and the reduced-motion block turns it off outright.
// The wipe rides the element's mount, which for the local data layer is the
// very first paint (see useAsync).
export const Hero = () => {
  const { data: profile, loading, error } = useAsync(getProfile);

  return (
    <section id="hero" className={styles.hero} aria-label="Introduction">
      {loading && <Loading />}
      {error !== null && <ErrorState />}
      {!loading && error === null && profile !== null && (
        <>
          <h1 className={`${styles.name} ${styles.wipe}`}>{profile.name}</h1>
          <p className={`${styles.headline} ${styles.wipe} ${styles.wipeStep1}`}>
            {profile.headline}
          </p>
          <p className={`${styles.wipe} ${styles.wipeStep1}`}>{profile.lookingFor}</p>
          {profile.currentlyLearning !== undefined && (
            <p className={`${styles.learning} ${styles.wipe} ${styles.wipeStep2}`}>
              Currently learning: {profile.currentlyLearning}
            </p>
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
