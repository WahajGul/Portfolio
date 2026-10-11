import styles from "./states.module.css";

// Shared error line for every section. Announced once, with a recovery
// hint; the technical detail stays in the thrown message for the console.
export const ErrorState = () => (
  <p className={styles.state} role="alert">
    Could not load this content. Reload the page to try again.
  </p>
);
