import { AssetCategory, findAssetEntry } from "@3d/generated-loader";
import { useStore } from "@3d/store";
import { coord, Transform, Vec2, vec2, WorldCoord } from "@3d/world/coord";
import { Entity } from "@3d/world/types";
import { isSome } from "@components/utils";
import { deepEqual } from "fast-equals";
import { Box2 } from "three";
import { match } from "ts-pattern";
import { mutation } from ".";
import { BuildStateBuild } from "../types";

const createStreet = (transform: Transform): Entity => {
  // streets are auto rotating and auto variant
  const [variant, rotation] = mutation.streets.type(
    ...coord.unwrap(transform.anchor)
  );
  return {
    category: "streets",
    id: "preview",
    transform: coord.transform.create(
      transform.anchor,
      vec2.splat(1),
      rotation
    ),
    type: "street",
    variant,
  };
};

const createBuilding = (
  transform: Transform,
  { id }: BuildStateBuild["payload"]
): Entity => {
  return {
    category: "buildings",
    id: "preview",
    transform,
    type: id,
  };
};

const createProp = (
  transform: Transform,
  { id, state: { rotation, variant } }: BuildStateBuild["payload"]
): Entity => {
  // Remove so that we have to lower left corner
  // position.value = vec2.sub(position.value, vec2.splat(0.1));
  // const transform = coord.range.create(position, vec2.splat(0.2), rotation);
  return {
    category: "props",
    id: "preview",
    transform,
    type: id,
    variant,
  };
};

let last: {
  type: BuildStateBuild["payload"]["type"];
  transform: Transform;
};
let cached: Entity;

const internalCreate = (
  transform: Transform,
  payload: BuildStateBuild["payload"]
) => {
  return match<BuildStateBuild["payload"], Entity>(payload)
    .with({ type: "streets" }, () => createStreet(transform))
    .with({ type: "buildings" }, (payload) =>
      createBuilding(transform, payload)
    )
    .with({ type: "props" }, (payload) => createProp(transform, payload))
    .exhaustive();
};

export const createPreviewEntity = (
  pointer: WorldCoord,
  payload: BuildStateBuild["payload"]
) => {
  // Try to smartly cache, we'll see
  // BRAINSTORM:
  // - Streets only need to recalculate if tile changes
  // - Buildings only need to recalculate if tile changes or the rotation changes
  // - Props need to recalculate if tile changes and
  const newState = {
    type: payload.type,
    transform: match(payload)
      .with({ type: "props" }, ({ state: { rotation } }) =>
        coord.transform.create(
          coord.tile.from(pointer),
          vec2.splat(0.2),
          rotation
        )
      )
      .with({ type: "streets" }, () =>
        coord.transform.create(
          coord.map(coord.tile.floor(pointer), (a) =>
            vec2.add(a, vec2.splat(0.5))
          ),
          vec2.splat(1),
          0
        )
      )
      .with({ type: "buildings" }, ({ id, state: { rotation } }) => {
        const entry = findAssetEntry<AssetCategory>("buildings", id);
        const extend = coord.tile.new(
          "extend" in entry ? (entry.extend as Vec2) : vec2.splat(1)
        );
        // lets sub half the extend and floor for the anchor
        const direction = coord.transform.direction({
          rotation: rotation ?? 0,
          extend,
        });
        // take the pointer and substract half the direction
        const base = coord.map(coord.tile.from(pointer), (a) =>
          vec2.sub(a, vec2.div(coord.unwrap(direction), vec2.splat(2)))
        );
        // floor and readd half of direction
        const anchor = coord.map(coord.tile.floor(base), (a) =>
          vec2.add(a, vec2.div(coord.unwrap(direction), vec2.splat(2)))
        );
        return coord.transform.create(anchor, coord.unwrap(extend), rotation);
      })
      .exhaustive(),
  };

  if (isSome(last) && deepEqual(last, newState)) {
    return cached;
  } else {
    const newValue = internalCreate(newState.transform, payload);
    cached = newValue;
    return newValue;
  }
};

// Check for validaty of scene
const box1 = new Box2(),
  box2 = new Box2();
export const checkPreviewValid = (
  entity: Entity
): true | { intersects: string[] } => {
  const get = useStore.getState;
  const { world } = get();
  // set preview box range
  coord.transform.box(entity.transform, box1);
  const transform = [
    ...world.entities
      // only check buildings
      .filter((e) => e.category === "buildings")
      .map((e) => [e.id, e.transform] as const),
    // only calculate problems with streets
    ...world.terrain
      .flatMap((row, x) =>
        row.map((t, z) =>
          t.type === "street"
            ? ([
                t.id,
                coord.transform.create(
                  coord.tile.create(x + 0.5, z + 0.5),
                  [1, 1],
                  t.rotation ?? 0
                ),
              ] as const)
            : undefined
        )
      )
      .filter(isSome),
  ];

  // now lets check if any of the entities are overlapping with the preview
  const intersets = transform
    .map(([id, t]) => {
      coord.transform.box(t, box2);
      const intersects = box1.intersectsBox(box2);
      return intersects ? id : undefined;
    })
    .filter(isSome);

  return intersets.length === 0 ? true : { intersects: intersets };
};
