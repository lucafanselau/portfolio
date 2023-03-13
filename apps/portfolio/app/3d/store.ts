import { range } from "@/utils";
import { produce } from "immer";
import { Group, Vector3 } from "three";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { initalTerrain } from "./world/inital";
import { TerrainType } from "./world/types";

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
  world: {
    terrain: [type: TerrainType, rotation: number][][];
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
    character: {
      state: "idle",
    },
    world: {
      terrain: initalTerrain,
    },
    setState: (state) => set({ state }),
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
