import { Store, useStore } from "@3d/store";
import { coord, Vec2, vec2 } from "@3d/world/coord";
import { isNone, isSome } from "@components/utils";
import { Draft } from "immer";
import { match, Pattern } from "ts-pattern";
import { previewEntity } from "../preview";
import { BuildStateBuild } from "../types";
import { streets } from "./streets";

export const build = () => {
  const { getState: get, setState: set } = useStore;
  // TODO: Check if build is valid

  const state = get();
  // reuse the preview entity routine
  const entity = previewEntity[0](state);
  if (isNone(entity)) return;
  if (entity.category === "streets") {
    streets.build(entity.transform.anchor);
    // TODO: Handle auto advance
    set((s) => {
      if (s.ui.mode.type === "build" && s.ui.mode.payload.type === "build") {
        const current = coord.unwrap(coord.tile.floor(entity.transform.anchor));
        // try to semi intelligently guess the next tile
        const [bx, bz] = current;
        // check all tile variants and find the next tile which is free and if two are free sits opposite to the street tile
        const variants = [
          [+1, 0],
          [-1, 0],
          [0, +1],
          [0, -1],
        ] as Vec2[];
        const free = variants.filter(([x, z]) => {
          const t = state.world.terrain[bx + x]?.[bz + z];
          return t?.type !== "street";
        });
        if (free.length === 3) {
          const taken = variants.find((v) => free.every((f) => !vec2.eq(v, f)));
          const delta = coord.tile.new(vec2.mul(taken!, vec2.splat(-1)));
          console.log(delta, free);
          s.pointer = coord.map(s.pointer, (p) =>
            vec2.add(p, coord.unwrap(coord.plane.from(delta)))
          );
        } else {
          const random = coord.tile.new(
            free[Math.floor(Math.random() * free.length)]
          );
          s.pointer = coord.map(s.pointer, (p) =>
            vec2.add(p, coord.unwrap(coord.plane.from(random)))
          );
        }
      }
    });
  } else {
    // just push back the entity
    set((s) => {
      // and we need to create a new id for the entity
      s.world.entities.push({
        ...entity,
        id: "entity-" + s.world.entities.length,
      });
      // also auto advance the pointer (by the extend of the entity (but only on one axis))
      const extend = coord.map(entity.transform.extend, ([a, _]) =>
        vec2.create(a, 0)
      );
      const direction = coord.transform.direction({
        extend,
        rotation: entity.transform.rotation,
      });
      s.pointer = coord.map(s.pointer, (p) =>
        vec2.add(p, coord.unwrap(coord.plane.from(direction)))
      );
    });
  }
};

export const destroy = () => {
  const { getState: get, setState: set } = useStore;
  // For now we will destroy everything that is currently hovered
  const {
    world: { hovered, terrain },
  } = get();

  if (hovered.length === 0) return;
  set((s) => {
    // remove all hovered entities
    s.world.entities = s.world.entities.filter(
      (e) => !hovered.some(([_, entity]) => entity === e.id)
    );
  });

  // remove all hovered tiles
  for (let x = 0; x < terrain.length; x++) {
    for (let z = 0; z < terrain[x].length; z++) {
      const t = terrain[x][z];
      if (t.type === "street" && hovered.some(([_, id]) => id === t.id))
        streets.destroy(coord.tile.create(x, z));
    }
  }

  // also reset hover, because we just deleted everything in it
  set((s) => void (s.world.hovered = []));
};

export const matchBuild = <R = void>(
  store: Draft<Store>,
  cb: {
    destroy: () => R;
    build: (state: Draft<BuildStateBuild["payload"]>) => R;
  }
): R | undefined => {
  return match<Store>(store)
    .with(
      {
        state: "build",
        ui: { mode: { type: "build", payload: { type: "destroy" } } },
      },
      cb.destroy
    )
    .with(
      {
        state: "build",
        ui: { mode: { type: "build", payload: { type: "build" } } },
      },
      (s) => cb.build(s.ui.mode.payload.payload)
    )
    .otherwise(() => undefined);
};

export const buildPattern = (
  type: "destroy" | "build"
): Pattern.Pattern<Store> => ({
  state: "build",
  // @ts-expect-error Not really any idea why this is not working
  ui: { mode: { type: "build", payload: { type: type } } },
});

export const buildOrDestroy = () => {
  const { getState: get, setState: set } = useStore;
  match<Store, void>(get())
    .with(buildPattern("build"), build)
    .with(buildPattern("destroy"), destroy)
    .otherwise(() => void 0);
};
