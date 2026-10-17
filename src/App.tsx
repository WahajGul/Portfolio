import { useRef, useState } from "react";
import { LazyMotion, type FeatureBundle } from "framer-motion";
import { ContactSection } from "./components/ContactSection";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { ProjectsSection } from "./components/ProjectsSection";
import { SkillsSection } from "./components/SkillsSection";
import { ThemeProvider } from "./context/ThemeContext";
import { MotionReadyContext } from "./hooks/useMotionReady";
import styles from "./App.module.css";

/* Site configuration, not page content: the repository this page is served
   from. Content lives in src/data and is read through the hooks. */
const REPOSITORY_URL = "https://github.com/WahajGul/Portfolio";

/* Read once, when the module loads: the footer is static, and reading the clock
   during a render is impure. */
const YEAR = new Date().getFullYear();

/** Tops out how long a busy browser may put the motion chunk off. */
const IDLE_TIMEOUT = 1000;

/** No requestIdleCallback in Safari: one short hop past the first paint. */
const IDLE_FALLBACK_DELAY = 200;

// Resolves at the browser's next idle moment, or after IDLE_TIMEOUT ms if the
// main thread never goes idle. requestIdleCallback is still not Baseline
// (Safari has no support), so the fallback is a plain timer. Either way this is
// only reached from LazyMotion's mount effect, which runs after the first
// commit: the motion chunk is never requested during the render that paints the
// first screen.
const whenIdle = (): Promise<void> =>
  new Promise((resolve) => {
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(() => resolve(), { timeout: IDLE_TIMEOUT });
      return;
    }
    setTimeout(resolve, IDLE_FALLBACK_DELAY);
  });

// Phase 1 shell: every section reads through the hooks in src/hooks, which call
// src/api/index.ts. The structure (landmarks, ids the nav targets, footer) is
// final, so wiring the data layer to a real API later touches no markup here.
export const App = () => {
  const [motionReady, setMotionReady] = useState(false);
  const features = useRef<Promise<FeatureBundle> | null>(null);

  // LazyMotion calls this from an effect after its first commit, and the fetch
  // itself waits for idle, so the motion bundle is well off the critical path:
  // the hero is CSS keyframes and the nav is plain CSS, so the first screen
  // renders without this library at all. The readiness flag turns on only when
  // the chunk has resolved; until then every reveal stays in its default,
  // visible state, which is what keeps a slow or blocked chunk from blanking a
  // section.
  //
  // domMax over domAnimation: the project plates reflow through
  // layout="position", and layout projection only ships in the max bundle.
  const loadFeatures = (): Promise<FeatureBundle> => {
    if (features.current === null) {
      features.current = whenIdle()
        .then(() => import("./lib/motionFeatures"))
        .then((module) => {
          setMotionReady(true);
          return module.default;
        });
    }
    return features.current;
  };

  return (
    <ThemeProvider>
      <MotionReadyContext.Provider value={motionReady}>
        {/* strict makes any full motion.* component a dev error, so m.* stays
            the only path. */}
        <LazyMotion features={loadFeatures} strict>
          <a className="skip-link" href="#content">
            Skip to content
          </a>
          <Navbar />
          {/* tabindex=-1 so the skip link moves focus here, not just scroll.
              No container class: each section is a full-bleed band that holds
              its own container, so the flat colors run edge to edge. */}
          <main id="content" tabIndex={-1} className={styles.main}>
            <Hero />
            <ProjectsSection />
            <SkillsSection />
            <ContactSection />
          </main>
          {/* No rule above the footer: DESIGN.md's bands separate regions by
              flat color, and the footer is its own band. */}
          <footer className={styles.footer}>
            <div className={`container ${styles.footerInner}`}>
              <p className={styles.footerNote}>&copy; {YEAR}</p>
              <a
                className={styles.footerLink}
                href={REPOSITORY_URL}
                target="_blank"
                rel="noreferrer"
              >
                Source code
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </div>
          </footer>
        </LazyMotion>
      </MotionReadyContext.Provider>
    </ThemeProvider>
  );
};
