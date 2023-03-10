import { useControls as useControlsOriginal } from "leva";

// @ts-expect-error This is complete bs, but we want the initial thing to be returned in non dev mode
export const useControls: typeof useControlsOriginal = (...params) => {
  if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
    return useControlsOriginal(...params);
  } else {
    return params[1];
  }
};
