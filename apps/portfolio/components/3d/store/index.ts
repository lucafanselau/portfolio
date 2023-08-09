import { BuildState } from "@3d/build/types";
import type { Interaction } from "@3d/constants";
import { constants } from "@3d/constants";
import { transitionVector3 } from "@3d/transition";
import { Terrain } from "@3d/world/types";
import { DeepPartial, isSome } from "@components/utils";
import type { ToolContentKeys } from "@content/tools";
import { invalidate } from "@react-three/fiber";
import { Vector3 } from "three";
import { match } from "ts-pattern";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { CharacterState, Store } from "./store";
import { defaultStore } from "./store";

export type { Store };

export type Actions = {
  updateState: (target: Store["state"]) => Promise<void>;
  updateTools: (
    config: { type: "dismiss" } | { type: "slide"; key: ToolContentKeys }
  ) => void;
  initBuild: (state: BuildState) => void;
  setPointer: (pointer: Store["pointer"]) => void;
  interact: (interaction: Interaction["title"] | undefined) => void;
  updateTarget: (target: Vector3) => void;
  updateCharacter: (state: CharacterState["state"]) => void;
  updatePosition: (vector: Vector3) => void;
  setTileType: (x: number, z: number, terrain: Terrain) => void;

  exportState: () => DeepPartial<Store>;
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
          s.camera.controlled.position = true;
          s.camera.controlled.target = true;
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
          s.camera.controlled.position = false;
          s.camera.controlled.target = target === "build" ? false : true;
          s.ui.transition = false;
          s.ui.mode = { type: "focus", key: "info" };
        });
      },
      updateTools: (config) => {
        match(config)
          .with({ type: "dismiss" }, () => {
            set((s) => void (s.ui.mode = { type: "closed" }));
          })
          .with({ type: "slide" }, ({ key }) =>
            set((s) => {
              if (s.ui.mode.type === "slide" && s.ui.mode.key === key) {
                s.ui.mode = { type: "closed" };
              } else {
                s.ui.mode = { type: "slide", key };
              }
            })
          )
          .exhaustive();
      },

      initBuild: (state) =>
        set((s) => {
          s.ui.mode = {
            type: "build",
            payload: state,
          };
        }),
      setPointer: (p) => set((s) => void (s.pointer = p)),
      interact: (i) =>
        set((s) => {
          if (isSome(i) && !s.world.interaction.history[i]) {
            // -> eg. this is the first time we interacted with this zone
            s.ui.mode = { type: "focus", key: i };
            s.world.interaction.history[i] = true;
          }
          s.world.interaction.current = i;
        }),
      updateTarget: (target) =>
        set((s) => {
          // kick of at least one frame
          invalidate();
          s.character.state = "rotate";
          console.log(target, s.target);
          s.target = new Vector3(target.x, 0, target.z);
        }),
      updateCharacter: (s) => set((state) => void (state.character.state = s)),
      updatePosition: (vector) =>
        set((s) => {
          s.character.position.copy(vector);
          if (!s.ui.transition && s.state === "explore") {
            s.camera.target
              .copy(vector)
              .add(constants.transitions.target.explore);
          }
        }),
      setTileType: (x, z, terrain) =>
        set((state) => {
          state.world.terrain[x][z] = terrain;
        }),
      exportState: () => {
        // get the important parts of the current state
        const {
          world: { terrain, entities },
        } = get();
        return {
          world: {
            terrain,
            entities,
          },
        };
      },
    }))
  )
);
