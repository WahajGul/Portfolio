import { flushSync } from "react-dom";
import { useLayoutEffect, useState } from "react";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Generic loader hook: { data, loading, error }. The loader must be a stable reference
// (the functions in src/api are module constants, so they are).
//
// Layout effect plus flushSync: the loader starts before the browser paints, and for an
// already-resolved promise (Phase 1's local JSON) the state update is forced through in
// the same task. The first paint is therefore the content itself — no loading line that
// then expands and shifts the page (CLS). On a real network fetch (Phase 3) the update
// lands whenever the response does, and the loading line shows, as it should. flushSync
// is safe in a promise callback: it runs outside React's render and commit phases.
export const useAsync = <T>(loader: () => Promise<T>): AsyncState<T> => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useLayoutEffect(() => {
    let cancelled = false;

    const apply = (next: AsyncState<T>) => {
      if (!cancelled) flushSync(() => setState(next));
    };

    loader()
      .then((data) => {
        apply({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Something went wrong.";
        apply({ data: null, loading: false, error: message });
      });

    return () => {
      cancelled = true;
    };
  }, [loader]);

  return state;
};
