import { BuildPreviewPlane } from "@3d/build/overlay";
import { AssetCategory, AssetKey, findAssetEntry } from "@3d/generated-loader";
import { models } from "@3d/generated/loader";
import { useStore } from "@3d/store";
import { isNone, isSome } from "@components/utils";
import { GroupProps } from "@react-three/fiber";
import { FC, useMemo } from "react";
import { coord } from "./coord";
import { Entity } from "./types";

type ModelLoaderProps<C extends AssetCategory> = {
  category: C;
  type: AssetKey<C>;
  variant?: string;
};
export const loadModel = <C extends AssetCategory>({
  category,
  type: key,
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

const pointerProps: GroupProps = {
  onPointerOver: (e) =>
    useStore.setState((s) => void s.world.hovered.push(e.object)),
  onPointerOut: (e) =>
    useStore.setState(
      (s) =>
        void (s.world.hovered = s.world.hovered.filter((h) => h !== e.object))
    ),
};

export const ModelLoader = <C extends AssetCategory>({
  entity,
}: {
  entity: Entity<C>;
}) => {
  const Model = useMemo(() => loadModel<C>(entity), [entity]);
  const { plane, wrapper, rotation, model } = coord.objects(entity.transform);
  if (isNone(Model)) return null;
  return (
    <group {...wrapper}>
      <group {...rotation}>
        <BuildPreviewPlane {...plane} />
        <Model {...pointerProps} {...model} />
      </group>
    </group>
  );
};
