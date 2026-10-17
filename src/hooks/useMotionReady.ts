import { createContext, useContext } from "react";

/*
 * True once Framer Motion's feature bundle has resolved. Reveals read this so
 * that the hidden pre-reveal state is only ever applied by Framer, never by the
 * base stylesheet: if the chunk is slow, blocked, or fails, every section stays
 * fully readable (see DESIGN.md, Performance).
 *
 * The context lives with the hook that reads it, in a file that exports no
 * components, so fast refresh keeps working (App provides the value).
 */
export const MotionReadyContext = createContext(false);

export const useMotionReady = (): boolean => useContext(MotionReadyContext);
