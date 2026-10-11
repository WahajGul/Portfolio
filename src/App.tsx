import { LazyMotion, domAnimation } from "framer-motion";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { ThemeProvider } from "./context/ThemeContext";
import styles from "./App.module.css";

// Phase 1 shell: the hero is wired to profile data; the remaining sections
// arrive in the next steps. The structure (landmarks, ids the nav targets,
// footer) is final.
export const App = () => (
  <ThemeProvider>
    {/* domAnimation keeps the bundle small: transform/opacity/clip-path
        animations and gestures only, no layout projection. strict makes any
        full motion.* component a dev error, so m.* stays the only path. */}
    <LazyMotion features={domAnimation} strict>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <Navbar />
      {/* tabindex=-1 so the skip link moves focus here, not just scroll. */}
      <main id="content" tabIndex={-1} className={`container ${styles.main}`}>
        <Hero />

        <section id="projects" aria-labelledby="projects-heading">
          <h2 id="projects-heading" className={styles.heading}>
            Projects
          </h2>
          <p className={styles.placeholder}>Project rows arrive in the next step.</p>
        </section>

        <section id="skills" aria-labelledby="skills-heading">
          <h2 id="skills-heading" className={styles.heading}>
            Skills
          </h2>
          <p className={styles.placeholder}>Skill groups arrive in the next step.</p>
        </section>

        <section id="contact" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className={styles.heading}>
            Contact
          </h2>
          <p className={styles.placeholder}>Contact links arrive in the next step.</p>
        </section>
      </main>
      <footer className={styles.footer}>
        <div className="container">
          <p className={styles.placeholder}>Footer content arrives in the footer step.</p>
        </div>
      </footer>
    </LazyMotion>
  </ThemeProvider>
);
