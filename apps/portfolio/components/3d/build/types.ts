import { AssetCategory } from "@3d/generated-loader";
import type { BuildingType, PropType } from "../world/types";

type StreetsPayload = { type: "streets" };
type BuildingsPayload = { type: "buildings"; building: BuildingType };
type PropsPayload = { type: "props"; prop: PropType };

type BuildStateBuild = {
  type: "build";
  payload: PropsPayload | BuildingsPayload | StreetsPayload;
};
type BuildStateDestroy = { type: "destroy"; payload: AssetCategory };

export type BuildState = BuildStateBuild | BuildStateDestroy;
