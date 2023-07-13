import { AssetCategory, AssetKey, findAssetEntry } from "@3d/generated-loader";
import { models } from "@3d/generated/loader";
import { isNone, isSome } from "@components/utils";
import { FC, useMemo } from "react";

type ModelLoaderProps<C extends AssetCategory> = {
  category: C;
  key: AssetKey<C>;
  variant?: string;
};
export const loadModel = <C extends AssetCategory>({
  category,
  key,
  variant,
}: ModelLoaderProps<C>) => {
  const entry = useMemo(() => findAssetEntry(category, key), [category, key]);

  if (isNone(entry)) return null;
  let id;
  if (isSome(variant) && Array.isArray(entry.file)) {
    const index = entry.file.findIndex((f) => f.id === variant);
    id = Array.isArray(entry.output) ? entry.output[index].id : undefined;
  } else {
    id = Array.isArray(entry.output) ? undefined : entry.output.id;
  }
  if (!id) return null;
  // @ts-expect-error: Variant is type unsafe
  const Model = models[category][id];
  if (!Model) return null;
  return Model;
};

export const ModelLoader = <{ model: }>
