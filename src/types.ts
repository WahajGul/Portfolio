export type ProjectStatus = "live" | "in-progress" | "planned";

export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  highlights?: string[];
  live?: string;
  repo?: string;
  image?: string;
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
  bio: string;
  currentlyLearning?: string;
  resumeUrl?: string;
}
