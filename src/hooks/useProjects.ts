import { getProjects } from "../api";
import type { Project } from "../types";
import { useAsync, type AsyncState } from "./useAsync";

export const useProjects = (): AsyncState<Project[]> => useAsync(getProjects);
