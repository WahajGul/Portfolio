import { domMax } from "framer-motion";

/*
 * Framer Motion's full DOM feature bundle, kept in a module of its own so the
 * bundler emits it as a separate chunk. LazyMotion asks for it from an effect
 * after its first commit, and App waits for the browser's first idle moment
 * before the import starts, which keeps the motion library off the critical
 * path entirely (see DESIGN.md, Performance).
 *
 * domMax, not domAnimation: the project plates reflow through
 * layout="position", and layout projection only ships in the max bundle.
 *
 * The default export is deliberate: LazyMotion's loader resolves to the bundle
 * object itself, not to a module namespace.
 */
export default domMax;
