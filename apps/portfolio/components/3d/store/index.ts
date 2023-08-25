import { BuildState } from "@3d/build/types";
import type { Interaction } from "@3d/constants";
import { constants } from "@3d/constants";
import { sleep, transitionVector3 } from "@3d/transition";
import { coord } from "@3d/world/coord";
import { useSlots } from "@3d/world/slots";
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
    config:
      | { type: "dismiss" }
      | { type: "slide" | "focus"; key: ToolContentKeys }
      | { type: "info" }
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

const ONE = new Vector3(1, 1, 1);

export const useStore = create<Store & Actions>()(
  immer(
    subscribeWithSelector((set, get) => ({
      ...defaultStore,
      // *******************************************************************
      // Actions
      updateState: async (target) => {
        if (target === undefined) return;
        // notify ui of transition
        set((s) => {
          s.ui.transition = true;
          s.camera.controlled.position = true;
          s.camera.controlled.target = true;
          // also let the land and buildings appear
        });

        // do the actual transition
        const { camera, world } = get();
        const { slots } = useSlots.getState();
        const tiles = world.terrain
          .flatMap((row, x) => row.map((terrain, z) => ({ x, z, terrain })))
          // filter out only the tiles that should appear
          .filter(({ terrain }) => terrain.appear === target);
        const entities = world.entities.filter(
          ({ appear }) => appear === target
        );

        // we also kick of the revealing of terrain, this promise does not need to be awaited to enter into the next ui state
        const promise = Promise.all([
          // and let the world appear
          ...tiles.map(async ({ terrain }, index) => {
            const slot = slots.get(terrain.id);
            if (isSome(slot)) {
              await sleep((index / tiles.length) * 1000);
              await transitionVector3(slot.scale, ONE, { smoothTime: 0.25 });
            }
          }),

          // and also the buildings
          ...entities.map(async ({ id }) => {
            const slot = slots.get(id);
            if (isSome(slot)) {
              await sleep(1000);
              await transitionVector3(slot.scale, ONE, { smoothTime: 0.25 });
            }
          }),
        ]);

        if (target === "start") await promise;

        // and the ui transition
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
        if (target !== "start") await promise;
      },
      updateTools: (config) => {
        match(config)
          .with({ type: "dismiss" }, () => {
            set((s) => {
              if (
                s.ui.mode.type === "build" &&
                s.ui.mode.payload.info !== false
              ) {
                s.ui.mode.payload.info = false;
              } else {
                s.ui.mode = { type: "closed" };
              }
            });
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
          .with({ type: "focus" }, (config) => {
            set((s) => void (s.ui.mode = config));
          })
          .with({ type: "info" }, (config) => {
            set((s) => {
              if (s.ui.mode.type !== "build") return;
              if (s.ui.mode.payload.info === false)
                s.ui.mode.payload.info = "slide";
              else s.ui.mode.payload.info = false;
            });
          })
          .exhaustive();
      },

      initBuild: (state) =>
        set((s) => {
          s.ui.mode = {
            type: "build",
            payload: state,
          };
        }),
      setPointer: (p) =>
        set((s) => {
          // bounds checking
          const [x, z] = coord.unwrap(coord.tile.from(p));
          console.log("set pointer", p, x, z);
          if (
            x < 0 ||
            x > constants.world.tiles ||
            z < 0 ||
            z > constants.world.tiles
          )
            return;
          console.log("setting it");
          s.pointer = p;
        }),
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
