export type ProjectStatus = "live" | "in-progress" | "planned";

export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  highlights?: string[];
  live?: string;
  repo?: string;
  /** `{w}` URL template, e.g. "/images/smdb-800-{w}.webp" -> 480/768/1200w. */
  image?: string;
  /** Required whenever `image` is set; a missing one strips the image only. */
  imageAlt?: string;
  /** Optional phone-shaped shot, served below 768px; same widths, same alt. */
  imageMobile?: string;
  /** Optional click-to-play demo URL, rendered as a link, never embedded. */
  demo?: string;
  status: ProjectStatus;
  featured?: boolean;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface Contact {
  id: string;
  label: string;
  value: string;
  href: string;
  icon?: string;
}

export interface Profile {
  name: string;
  headline: string;
  /** The separate hero line stating what kind of role is being sought. */
  lookingFor: string;
  /**
   * Optional and not rendered: the first screen is budgeted to four lines (see
   * the height budget in DESIGN.md), and a bio paragraph would push the lead
   * project's title, status, and stack past the fold on a 390px phone. It is
   * kept in the type so a later "about" line can read it without a data change.
   */
  bio?: string;
  currentlyLearning?: string;
  resumeUrl?: string;
}
