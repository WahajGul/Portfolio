import { getSkills } from "../api";
import type { SkillGroup } from "../types";
import { useAsync, type AsyncState } from "./useAsync";

export const useSkills = (): AsyncState<SkillGroup[]> => useAsync(getSkills);
