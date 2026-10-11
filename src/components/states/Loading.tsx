import styles from "./states.module.css";

// Shared loading line for every section. One quiet line, never a spinner or
// a full-screen loader: with local Phase 1 data this resolves within a frame.
export const Loading = () => <p className={styles.state}>Loading...</p>;
