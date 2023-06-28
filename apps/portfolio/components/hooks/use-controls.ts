import { useControls as useControlsOriginal } from "leva";

// @ts-expect-error This is complete bs, but we want the initial thing to be returned in non dev mode
export const useControls: typeof useControlsOriginal =
  process.env.NEXT_PUBLIC_NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_ENABLE_DEBUG
    ? useControlsOriginal
    : (...params) => {
        return params[1];
      };
