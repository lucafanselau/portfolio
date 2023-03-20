import { create } from "zustand";

type State = {
  state:
    | {
        type: "build";
        mode: "street" | "building" | "props";
      }
    | undefined;

  point?: [number, number];
  startBuild: (mode: "street" | "building" | "props") => void;
};

export const useToolsStore = create<State>((set) => ({
  state: undefined,
  startBuild: (mode) => set({ state: { type: "build", mode } }),
}));
