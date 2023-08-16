import { AssetCategory, AssetKey } from "@3d/generated-loader";
import { Store } from "@3d/store";
import { Transform } from "./coord";

// export type BaseTerrain = {};

export type StreetVariant = "end" | "straight" | "turn" | "three" | "four";
export type Terrain = (
  | { type: "flat" }
  | { type: "clipping" }
  | {
      type: "street";
      rotation: number;
      variant: StreetVariant;
    }
) & { id: string; appear?: Store["state"] };

export const terrainId = (x: number, z: number) => {
  return `terrain-${x}-${z}`;
};

export type Entity<C extends AssetCategory = AssetCategory> = {
  id: string;
  category: C;
  type: AssetKey<C>;
  transform: Transform;
  variant?: string;
  hidden?: boolean;
};
