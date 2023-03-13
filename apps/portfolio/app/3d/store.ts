import { range } from "@/utils";
import { Group, Vector3 } from "three";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { TerrainType } from "./world/types";
import { produce } from "immer";
import { constants } from "@3d/constants";

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
    terrain: TerrainType[][];
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
  setTileType: (x: number, z: number, type: TerrainType) => void;
};

const randomElement = () => {
  const array = range(0, TerrainType.StreetFour);
  return array[Math.floor(Math.random() * array.length)];
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
      terrain: range(0, constants.world.tiles).map(() =>
        range(0, constants.world.tiles).map(randomElement)
      ),
    },
    setState: (state) => set({ state }),
    setSlot: (slot, value) =>
      set((state) => ({ slots: { ...state.slots, [slot]: value } })),
    setCharacterState: (s) => set((state) => ({ character: s })),
    setTileType: (x, z, type) =>
      set((state) => ({
        ...state,
        world: produce(state.world, (draft) => {
          draft.terrain[x][z] = type;
        }),
      })),
  }))
);
