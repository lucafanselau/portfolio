import type { AssetCategory, AssetEntry } from "@3d/generated-loader";
import { defaultStreetsEntry, findAssetEntry } from "@3d/generated-loader";
import { selectors } from "@3d/store/selector";
import type { Store } from "@3d/store/store";
import { coord, TileRange, vec2 } from "@3d/world/coord";
import { deepEqual } from "fast-equals";
import { match, P } from "ts-pattern";
import type { BuildingType, PropType } from "../world/types";
import { mutation } from "./mutation";

type StreetsPayload = { type: "streets" };
type BuildingsPayload = {
  type: "buildings";
  id: BuildingType;
  state: { invalid?: boolean; rotation: number };
};
type PropsPayload = {
  type: "props";
  id: PropType;
  state: { rotation: number; variant?: string };
};

export type BuildStateBuild = {
  type: "build";
  payload: PropsPayload | BuildingsPayload | StreetsPayload;
};
type BuildStateDestroy = { type: "destroy" };
export type BuildState = BuildStateBuild | BuildStateDestroy;

// export const buildEntry = selectors.pack(
//   (store: Store): AssetEntry<"props"> | undefined => {
//     if (store.ui.mode.type !== "build") return undefined;
//     const state = store.ui.mode.payload;
//     if (state.type !== "build") return undefined;
//     const payload = state.payload;

//     return match(payload)
//       .with({ type: P.union("props", "buildings") }, ({ type, id }) =>
//         findAssetEntry(type, id)
//       )
//       .with({ type: "streets" }, () => defaultStreetsEntry)
//       .exhaustive();
//   }
// );

// Selector to select the current rotation and variant for the build
export const buildRange = selectors.pack((store: Store) => {
  if (store.ui.mode.type !== "build") return undefined;
  const state = store.ui.mode.payload;
  if (state.type !== "build") return undefined;
  const payload = state.payload;
  const pointer = coord.tile.from(store.pointer);

  return match<BuildStateBuild["payload"], [TileRange, string | undefined]>(
    payload
  )
    .with({ type: "streets" }, () => {
      // streets are auto rotating and auto variant
      const [variant, rotation] = mutation.streets.type(
        ...coord.unwrap(pointer)
      );
      return [coord.range.create(pointer, vec2.splat(1), rotation), variant];
    })
    .with({ type: "buildings" }, ({ id, state: { rotation } }) => {
      return [coord.range.building(pointer, id, rotation), undefined];
    })
    .with({ type: "props" }, ({ id, state: { rotation, variant } }) => {
      const position = coord.tile.exact(store.pointer);
      // Remove so that we have to lower left corner
      position.value = vec2.sub(position.value, vec2.splat(0.1));
      return [coord.range.create(position, vec2.splat(0.2), rotation), variant];
    })
    .exhaustive();
}, deepEqual);
