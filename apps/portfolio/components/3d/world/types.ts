import { AssetCategory, AssetKey } from "@3d/generated-loader";
import type { models } from "@3d/generated/loader";
import type { Vector3 } from "three";
import { PlaneCoord, TileRange } from "./coord";

export type BuildingType = keyof (typeof models)["buildings"];
export type PropType = keyof (typeof models)["props"];

export type Terrain =
  | { type: "flat" }
  | { type: "clipping" }
  | {
      type: "street";
      variant: "end" | "straight" | "turn" | "three" | "four";
      range: TileRange;
    };

export type Entity<C extends AssetCategory = AssetCategory> = {
  id: string;
  category: C;
  type: AssetKey<C>;
  transform: TileRange;
  variant?: string;
};
