import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type ToolsState =
  | {
      type: "build";
      mode: "street" | "building" | "props";
    }
  | { type: "destroy" };

type State = {
  state?: ToolsState;
  point?: [number, number];
  startBuild: (mode: "street" | "building" | "props") => void;
  startDestroy: () => void;
  end: () => void;
};

export const useToolsStore = create<State>()(
  subscribeWithSelector((set) => ({
    state: undefined,
    startBuild: (mode) => set({ state: { type: "build", mode } }),
    startDestroy: () => set({ state: { type: "destroy" } }),
    end: () => set({ state: undefined }),
  }))
);
