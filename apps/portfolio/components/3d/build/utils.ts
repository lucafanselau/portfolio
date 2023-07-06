import { AssetCategory } from "@3d/generated-loader";
import collection from "@3d/generated/collection.json";

export const findAssetEntry = <C extends AssetCategory>(
  category: C,
  item: keyof (typeof collection)[C]
) => {};
