import {
  AssetCategory,
  AssetEntry,
  defaultStreetsEntry,
  findAssetEntry,
} from "@3d/generated-loader";
import { selectors } from "@3d/store/selector";
import type { Store } from "@3d/store/store";
import { match, P } from "ts-pattern";
import type { BuildingType, PropType } from "../world/types";

type StreetsPayload = { type: "streets" };
type BuildingsPayload = { type: "buildings"; id: BuildingType };
type PropsPayload = { type: "props"; id: PropType };

type BuildStateBuild = {
  type: "build";
  payload: PropsPayload | BuildingsPayload | StreetsPayload;
};
type BuildStateDestroy = { type: "destroy"; payload: AssetCategory };
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
