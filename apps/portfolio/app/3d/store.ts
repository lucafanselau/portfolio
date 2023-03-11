import { Group, Vector3 } from "three";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type Store = {
  target: Vector3;
  slots: {
    guy?: Group | null;
    model?: Group | null;
    camera?: Group | null;
  };
  state: "start" | "explore" | "top-level";
  character:
    | {
        state: "idle";
      }
    | {
        state: "walk" | "run" | "rotate";
      }
    | {
        state: "long-idle" | "interact";
      };
};
export type State = Store["state"];
export type CharacterState = Store["character"];

type Actions = {
  setState: (state: Store["state"]) => void;
  setSlot: (
    slot: keyof Store["slots"],
    value: Store["slots"][keyof Store["slots"]]
  ) => void;
  setCharacterState: (state: CharacterState) => void;
};

export const useStore = create<Store & Actions>()(
  subscribeWithSelector((set, get) => ({
    target: new Vector3(),
    slots: {},
    state: "start",
    character: {
      state: "idle",
    },
    setState: (state) => set({ state }),
    setSlot: (slot, value) =>
      set((state) => ({ slots: { ...state.slots, [slot]: value } })),
    setCharacterState: (s) => set((state) => ({ character: s })),
  }))
);
