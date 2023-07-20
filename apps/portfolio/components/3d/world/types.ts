import { AssetCategory, AssetKey } from "@3d/generated-loader";
import { Transform } from "./coord";

export type BaseTerrain = {
  transform: Transform;
};

export type StreetVariant = "end" | "straight" | "turn" | "three" | "four";
export type Terrain = BaseTerrain &
  (
    | { type: "flat" }
    | { type: "clipping" }
    | {
        type: "street";
        variant: StreetVariant;
      }
  );

export type Entity<C extends AssetCategory = AssetCategory> = {
  id: string;
  category: C;
  type: AssetKey<C>;
  transform: Transform;
  variant?: string;
};
