import { AssetCategory, AssetKey } from "@3d/generated-loader";
import { PlaneCoord, TileRange } from "./coord";

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
