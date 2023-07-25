import { useEffect } from "react";
import { useStore } from ".";
import { selectors } from "./selector";

export const useSubscribe = <T>(
  selector: ReturnType<typeof selectors.pack<T>>,
  cb: (t: T) => void
) => {
  useEffect(() => {
    const [sel, eq] = selector;
    cb(sel(useStore.getState()));
    return useStore.subscribe(sel, cb, { equalityFn: eq });
  }, [selector, cb]);
};
