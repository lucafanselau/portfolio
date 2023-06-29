import { isSome } from "@components/utils";
import type { ToolContentKeys } from "@content/tools";
import { produce } from "immer";
import { Group, Vector3 } from "three";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { constants, Interaction } from "@3d/constants";
import { CharacterState, defaultStore, Store } from "./store";
import { Building, TerrainType } from "@3d/world/types";
import { transitionVector3 } from "@3d/transition";

type Actions = {
  updateState: (target: Store["state"]) => Promise<void>;
  updateTools: (
    config: { type: "dismiss" } | { type: "slide"; key: ToolContentKeys }
  ) => void;
  interact: (interaction: Interaction["title"] | undefined) => void;
  updateTarget: (target: Vector3) => void;
  updateCharacter: (state: CharacterState) => void;
  setTileType: (
    x: number,
    z: number,
    type: TerrainType,
    rotation?: number
  ) => void;
};

export const useStore = create<Store & Actions>()(
  immer(
    subscribeWithSelector((set, get) => ({
      ...defaultStore,
      // *******************************************************************
      // Actions
      updateState: async (target) => {
        // notify ui of transition
        set((s) => {
          s.ui.transition = true;
          s.camera.locked = true;
        });

        // do the actual transition
        const { camera } = get();
        await Promise.all([
          transitionVector3(
            camera.position,
            constants.transitions.position[target]
          ),
          transitionVector3(
            camera.target,
            constants.transitions.target[target]
          ),
        ]);

        // after that update everything in the store
        set((s) => {
          s.state = target;
          s.camera.locked = false;
          s.ui.transition = false;
          s.ui.key = "info";
          s.ui.mode = "focus";
        });
      },
      updateTools: (config) => {
        // TODO: Handle ui interactions
      },
      interact: (i) =>
        set((s) => {
          s.world.interaction.history[i] = true;
          s.world.interaction.current = i;
        }),
      // setSlot: (slot, value) =>
      //   set((state) => ({ slots: { ...state.slots, [slot]: value } })),
      updateTarget: (target) =>
        set((s) => {
          s.character.state = "rotate";
          s.target = target;
        }),
      updateCharacter: (s) => set((state) => void (s.character = s)),
      setTileType: (x, z, type, rotation = 0) =>
        set((state) => ({
          ...state,
          world: produce(state.world, (draft) => {
            draft.terrain[x][z] = [type, rotation];
          }),
        })),
    }))
  )
);
