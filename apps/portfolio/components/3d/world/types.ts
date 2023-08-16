import { AssetCategory, AssetKey } from "@3d/generated-loader";
import { Transform } from "./coord";

// export type BaseTerrain = {};

export type StreetVariant = "end" | "straight" | "turn" | "three" | "four";
export type Terrain = (
  | { type: "flat" }
  | { type: "clipping" }
  | {
      type: "street";
      rotation: number;
      id: string;
      variant: StreetVariant;
    }
) & { shown: boolean };

export const streetId = (x: number, z: number) => {
  return `street-${x}-${z}`;
};

export type Entity<C extends AssetCategory = AssetCategory> = {
  id: string;
  category: C;
  type: AssetKey<C>;
  transform: Transform;
  variant?: string;
  hidden?: boolean;
};
