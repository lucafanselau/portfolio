import type { AssetCategory, AssetEntry } from "@3d/generated-loader";
import { defaultStreetsEntry, findAssetEntry } from "@3d/generated-loader";
import { selectors } from "@3d/store/selector";
import type { Store } from "@3d/store/store";
import { coord, vec2 } from "@3d/world/coord";
import { deepEqual } from "fast-equals";
import { match, P } from "ts-pattern";
import type { BuildingType, PropType } from "../world/types";

type StreetsPayload = { type: "streets"; state: { rotation: number } };
type BuildingsPayload = {
  type: "buildings";
  id: BuildingType;
  state: { invalid?: boolean; rotation: number };
};
type PropsPayload = { type: "props"; id: PropType };

export type BuildStateBuild = {
  type: "build";
  payload: PropsPayload | BuildingsPayload | StreetsPayload;
};
type BuildStateDestroy = { type: "destroy" };
export type BuildState = BuildStateBuild | BuildStateDestroy;

export const buildEntry = selectors.pack(
  (store: Store): AssetEntry<"props"> | undefined => {
    if (store.ui.mode.type !== "build") return undefined;
    const state = store.ui.mode.payload;
    if (state.type !== "build") return undefined;
    const payload = state.payload;

    return match(payload)
      .with({ type: P.union("props", "buildings") }, ({ type, id }) =>
        findAssetEntry(type, id)
      )
      .with({ type: "streets" }, () => defaultStreetsEntry)
      .exhaustive();
  }
);

export const buildRange = selectors.pack((store: Store) => {
  if (store.ui.mode.type !== "build") return undefined;
  const state = store.ui.mode.payload;
  if (state.type !== "build") return undefined;
  const payload = state.payload;
  const pointer = store.pointer;

  return match(payload)
    .with({ type: "streets" }, () => {
      return coord.range.create(pointer, vec2.splat(1), rotation);
    })
    .with({ type: "buildings" }, ({ id, state: { rotation } }) => {
      return coord.range.building(pointer, id, rotation);
    })
    .with({ type: P.union("props", "buildings") }, ({ type, id }) =>
      findAssetEntry(type, id)
    )
    .with({ type: "streets" }, () => defaultStreetsEntry)
    .exhaustive();
}, deepEqual);
