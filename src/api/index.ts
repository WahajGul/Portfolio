import contactsJson from "../data/contacts.json";
import profileJson from "../data/profile.json";
import projectsJson from "../data/projects.json";
import skillsJson from "../data/skills.json";
import type { Contact, Profile, Project, ProjectStatus, SkillGroup } from "../types";

// Runtime guards: JSON (and later, network responses) are never trusted to match the
// types. Invalid entries are dropped with a warning that names the offending id.

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const isProjectStatus = (value: unknown): value is ProjectStatus =>
  value === "live" || value === "in-progress" || value === "planned";

const isOptionalBoolean = (value: unknown): boolean =>
  value === undefined || typeof value === "boolean";

const warnDropped = (kind: string, value: unknown): void => {
  const fallback = isRecord(value) && isNonEmptyString(value.group) ? value.group : "unknown";
  const id = isRecord(value) && isNonEmptyString(value.id) ? value.id : fallback;
  console.warn(`[data] dropping invalid ${kind} entry: ${id}`);
};

const isProject = (value: unknown): value is Project => {
  if (!isRecord(value)) return false;
  const valid =
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.title) &&
    isNonEmptyString(value.description) &&
    isStringArray(value.stack) &&
    isProjectStatus(value.status) &&
    (value.highlights === undefined || isStringArray(value.highlights)) &&
    (value.live === undefined || isNonEmptyString(value.live)) &&
    (value.repo === undefined || isNonEmptyString(value.repo)) &&
    (value.image === undefined || isNonEmptyString(value.image)) &&
    (value.imageAlt === undefined || isNonEmptyString(value.imageAlt)) &&
    (value.imageMobile === undefined || isNonEmptyString(value.imageMobile)) &&
    (value.demo === undefined || isNonEmptyString(value.demo)) &&
    isOptionalBoolean(value.featured);
  if (!valid) warnDropped("project", value);
  return valid;
};

/**
 * A screenshot is data about the image, not about the project: an `image` with
 * no authored `imageAlt` is stripped (with a warning naming the project) and the
 * project stays, rendering text-only. This is the one place a guard rewrites an
 * entry instead of dropping it, and it is deliberate.
 */
const withoutBadImage = (project: Project): Project => {
  if (project.image === undefined) {
    if (project.imageMobile !== undefined) {
      console.warn(
        `[data] project "${project.id}" has an imageMobile but no image; dropping the mobile source`
      );
      return { ...project, imageMobile: undefined };
    }
    return project;
  }

  if (project.imageAlt !== undefined) return project;

  console.warn(
    `[data] project "${project.id}" has an image but no imageAlt; dropping the image and keeping the project`
  );
  return { ...project, image: undefined, imageMobile: undefined };
};

const isSkillGroup = (value: unknown): value is SkillGroup => {
  if (!isRecord(value)) return false;
  const valid = isNonEmptyString(value.group) && isStringArray(value.items);
  if (!valid) warnDropped("skill group", value);
  return valid;
};

const isContact = (value: unknown): value is Contact => {
  if (!isRecord(value)) return false;
  const valid =
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.label) &&
    isNonEmptyString(value.value) &&
    isNonEmptyString(value.href) &&
    (value.icon === undefined || isNonEmptyString(value.icon));
  if (!valid) warnDropped("contact", value);
  return valid;
};

const isProfile = (value: unknown): value is Profile =>
  isRecord(value) &&
  isNonEmptyString(value.name) &&
  isNonEmptyString(value.headline) &&
  isNonEmptyString(value.lookingFor) &&
  isNonEmptyString(value.bio) &&
  (value.currentlyLearning === undefined || isNonEmptyString(value.currentlyLearning)) &&
  (value.resumeUrl === undefined || isNonEmptyString(value.resumeUrl));

// Phase 1: local JSON behind async functions. Phase 3: swap only these bodies for
// fetch(`${import.meta.env.VITE_API_URL}/...`) calls; shapes and guards stay identical.

export const getProjects = async (): Promise<Project[]> => {
  const entries: unknown = projectsJson;
  if (!Array.isArray(entries)) {
    console.warn("[data] projects.json is not an array; returning an empty list");
    return [];
  }
  return entries
    .filter(isProject)
    .map(withoutBadImage)
    .sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
};

export const getSkills = async (): Promise<SkillGroup[]> => {
  const entries: unknown = skillsJson;
  if (!Array.isArray(entries)) {
    console.warn("[data] skills.json is not an array; returning an empty list");
    return [];
  }
  return entries.filter(isSkillGroup);
};

export const getContacts = async (): Promise<Contact[]> => {
  const entries: unknown = contactsJson;
  if (!Array.isArray(entries)) {
    console.warn("[data] contacts.json is not an array; returning an empty list");
    return [];
  }
  return entries.filter(isContact);
};

export const getProfile = async (): Promise<Profile> => {
  if (!isProfile(profileJson)) {
    throw new Error(
      "[data] profile.json is invalid; check the required fields (name, headline, lookingFor, bio)"
    );
  }
  return profileJson;
};
