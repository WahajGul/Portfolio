import { getContacts } from "../api";
import type { Contact } from "../types";
import { useAsync, type AsyncState } from "./useAsync";

export const useContacts = (): AsyncState<Contact[]> => useAsync(getContacts);
