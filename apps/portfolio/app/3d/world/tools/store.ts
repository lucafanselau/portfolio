import { create } from "zustand";

type State = {
  state:
    | {
        type: "build";
        mode: "street" | "building" | "props";
      }
    | { type: "destroy" }
    | undefined;

  point?: [number, number];
  startBuild: (mode: "street" | "building" | "props") => void;
  startDestroy: () => void;
  end: () => void;
};

export const useToolsStore = create<State>((set) => ({
  state: undefined,
  startBuild: (mode) => set({ state: { type: "build", mode } }),
  startDestroy: () => set({ state: { type: "destroy" } }),
  end: () => set({ state: undefined }),
}));
