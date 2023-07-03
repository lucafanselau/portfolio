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
import { match } from "ts-pattern";
import { GeneratedKeys } from "@3d/generated-loader";

type Actions = {
  updateState: (target: Store["state"]) => Promise<void>;
  updateTools: (
    config: { type: "dismiss" } | { type: "slide"; key: ToolContentKeys }
  ) => void;
  startBuild: (key: GeneratedKeys, id: string) => void;
  startDestroy: () => void;
  setPointer: (pointer: Store["pointer"]) => void;
  interact: (interaction: Interaction["title"] | undefined) => void;
  updateTarget: (target: Vector3) => void;
  updateCharacter: (state: CharacterState["state"]) => void;
  updatePosition: (vector: Vector3) => void;
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
      startBuild: (key, id) =>
        set((s) => {
          s.ui.mode = {
            type: "build",
            // @ts-ignore
            mode: { type: "build", key: { type: key, id } },
          };
        }),
      startDestroy: () =>
        set(
          (s) => void (s.ui.mode = { type: "build", mode: { type: "destroy" } })
        ),
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
          s.character.state = "rotate";
          s.target = target;
        }),
      updateCharacter: (s) => set((state) => void (state.character.state = s)),
      updatePosition: (vector) =>
        set((s) => {
          s.character.position.copy(vector);
          if (!s.ui.transition && s.state === "explore") {
            s.camera.target
              .copy(vector)
              .add(constants.transitions.target["explore"]);
          }
        }),
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
