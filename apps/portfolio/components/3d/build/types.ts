import type { AssetCategory, AssetEntry, AssetKey } from "@3d/generated-loader";

type StreetsPayload = { type: "streets" };
type BuildingsPayload = {
  type: "buildings";
  id: AssetKey<"buildings">;
  state: { invalid?: boolean; rotation: number };
};
type PropsPayload = {
  type: "props";
  id: AssetKey<"props">;
  state: { rotation: number; variant?: string };
};

export type BuildStateBuild = {
  type: "build";
  payload: PropsPayload | BuildingsPayload | StreetsPayload;
};
type BuildStateDestroy = { type: "destroy" };
export type BuildState = BuildStateBuild | BuildStateDestroy;
