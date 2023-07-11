import { mutation } from "@3d/build/mutation";
import { buildPosition } from "@3d/build/preview";
import { point } from "@3d/build/utils";
import type { Interaction } from "@3d/constants";
import { constants } from "@3d/constants";
import type { AssetCategory } from "@3d/generated-loader";
import { transitionVector3 } from "@3d/transition";
import type { TerrainType } from "@3d/world/types";
import { isNone, isSome } from "@components/utils";
import type { ToolContentKeys } from "@content/tools";
import { produce } from "immer";
import { Vector3 } from "three";
import { match } from "ts-pattern";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { selectors } from "./selector";
import type { CharacterState, Store } from "./store";
import { defaultStore } from "./store";

type Actions = {
  updateState: (target: Store["state"]) => Promise<void>;
  updateTools: (
    config: { type: "dismiss" } | { type: "slide"; key: ToolContentKeys }
  ) => void;
  startBuild: (key: AssetCategory, id: string) => void;
  startDestroy: () => void;
  build: (type: "click" | "drag") => void;
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
            // @ts-expect-error (i dunno go figure it out yourself)
            payload: { type: "build", payload: { type: key, id, state: {} } },
          };
        }),
      startDestroy: () =>
        set(
          (s) =>
            void (s.ui.mode = {
              type: "build",
              payload: { type: "destroy" },
            })
        ),

      build: (build) => {
        const {
          ui: { mode },
          pointer,
        } = get();
        if (mode.type !== "build" || isNone(pointer)) return;
        match(mode.payload)
          .with({ type: "build", payload: { type: "streets" } }, () => {
            const tile = point.tile.to(pointer);
            console.log(pointer, tile);
            mutation.streets.build(tile);
          })
          .with(
            { type: "build", payload: { type: "buildings" } },
            ({ payload: { id } }) =>
              set((s) => {
                const pos = buildPosition[0](s);
                if (isNone(pos)) return;
                const position = new Vector3(pos[0], 0, pos[1]);
                s.world.buildings.push({
                  position,
                  id: `${id}-${s.world.buildings.length}`,
                  rotation: 0,
                  type: id,
                });
              })
          )
          .with(
            { type: "build", payload: { type: "props" } },
            ({ payload: { id } }) =>
              set((s) => {
                const pos = selectors.pointer[0](s);
                if (isNone(pos)) return;
                const position = new Vector3(pos[0], 0, pos[1]);
                s.world.props.push({
                  position,
                  id: `${id}-${s.world.props.length}`,
                  rotation: 0,
                  type: id,
                });
              })
          )
          .with({ type: "destroy" }, () => {})
          .exhaustive();
        // const { type } = mode.mode;
        // if (!pointer) return;
        // const [x, z] = pointer;
        // if (type === "build") mutation.build.street(x, z);
        // else if (type === "destroy") mutation.destroy.street(x, z);
      },
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
              .add(constants.transitions.target.explore);
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
