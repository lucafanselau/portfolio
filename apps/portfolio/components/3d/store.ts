import { isSome } from "@components/utils";
import type { ToolContentKeys } from "@content/tools";
import { produce } from "immer";
import { Group, Vector3 } from "three";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Interaction } from "./constants";
import { initial } from "./world/inital";
import { Building, TerrainType } from "./world/types";

export type Store = {
  target: Vector3;
  slots: {
    guy?: Group | null;
    model?: Group | null;
    camera?: Group | null;
  };
  state: "start" | "explore" | "build";
  ui: {
    mode: "focus" | "slide" | "closed";
    subpart: ToolContentKeys;
  };
  showCard: boolean;
  character: { state: "idle" | "walk" | "run" | "rotate" | "greet" };
  world: {
    terrain: [type: TerrainType, rotation: number][][];
    buildings: Building[];
    interaction?: Interaction["title"];
    interactionHistory: Record<Interaction["title"], boolean>;
  };
};

export type State = Store["state"];
export type CharacterState = Store["character"];

type Actions = {
  setState: (state: Store["state"]) => void;
  toggleUISlide: () => void;
  setInteraction: (interaction: Interaction["title"] | undefined) => void;
  setSlot: (
    slot: keyof Store["slots"],
    value: Store["slots"][keyof Store["slots"]]
  ) => void;
  setCharacterState: (state: CharacterState) => void;
  setTileType: (
    x: number,
    z: number,
    type: TerrainType,
    rotation?: number
  ) => void;
};

export const useStore = create<Store & Actions>()(
  subscribeWithSelector((set, get) => ({
    target: new Vector3(),
    slots: {},
    state: "start",
    ui: {
      mode: "focus",
      subpart: "info",
    },
    showCard: true,
    character: {
      state: "greet",
    },
    world: {
      terrain: initial.terrain,
      buildings: initial.buildings,
      interactionHistory: { home: false, office: false, school: false },
    },
    // new state always also starts in focus ui mode
    setState: (state) => set({ state, ui: { mode: "focus", subpart: "info" } }),
    toggleUISlide: () =>
      set({
        ui: {
          mode: get().ui.mode === "slide" ? "closed" : "slide",
          subpart: get().ui.subpart,
        },
      }),
    setInteraction: (i) =>
      set((s) => {
        const history = isSome(i)
          ? { ...s.world.interactionHistory, [i]: true }
          : s.world.interactionHistory;
        return {
          world: {
            ...s.world,
            interaction: i,
            interactionHistory: history,
          },
        };
      }),
    setSlot: (slot, value) =>
      set((state) => ({ slots: { ...state.slots, [slot]: value } })),
    setCharacterState: (s) => set((state) => ({ character: s })),
    setTileType: (x, z, type, rotation = 0) =>
      set((state) => ({
        ...state,
        world: produce(state.world, (draft) => {
          draft.terrain[x][z] = [type, rotation];
        }),
      })),
  }))
);
