import { BuildPreviewPlane } from "@3d/build/overlay";
import { AssetCategory, AssetKey, findAssetEntry } from "@3d/generated-loader";
import { models } from "@3d/generated/loader";
import { useStore } from "@3d/store";
import { isNone, isSome } from "@components/utils";
import { Slot } from "@radix-ui/react-slot";
import { Plane } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import { ComponentType, ReactNode, useMemo } from "react";
import { MeshStandardMaterial } from "three";
import { match } from "ts-pattern";
import { coord, Transform } from "./coord";
import { Entity, Terrain } from "./types";

type ModelLoaderProps<C extends AssetCategory> = {
  category: C;
  type: AssetKey<C>;
  variant?: string;
};
export const findModel = <C extends AssetCategory>({
  category,
  type: key,
  variant,
}: ModelLoaderProps<C>): ComponentType<GroupProps> | null => {
  const entry = findAssetEntry(category, key);

  if (isNone(entry)) return null;
  let id;
  if (isSome(variant) && Array.isArray(entry.file)) {
    const index = entry.file.findIndex((f) => f.id === variant);
    id = Array.isArray(entry.output) ? entry.output[index].id : undefined;
  } else {
    id = Array.isArray(entry.output) ? undefined : entry.output.id;
  }
  if (!id) return null;
  const Model = models[category][id as keyof (typeof models)[C]];
  if (!Model) return null;
  return Model as ComponentType;
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

export const RangeLoader = ({
  range,
  children,

  plane: enablePlane = true,
  planeProps = false,
}: {
  range: Transform;
  children?: ReactNode;

  // config stuff
  plane?: boolean; // enable plane
  planeProps?: boolean; // treat children like a plane
}) => {
  const { plane, wrapper, rotation, model } = coord.objects(range);
  return (
    <group {...wrapper}>
      <group {...rotation}>
        {enablePlane && <BuildPreviewPlane {...plane} />}
        <Slot {...(!planeProps ? model : plane)}>{children}</Slot>
      </group>
    </group>
  );
};

export const ModelLoader = <C extends AssetCategory>({
  entity,
}: {
  entity: Entity<C>;
}) => {
  const Model = useMemo(() => findModel<C>(entity), [entity]);
  if (isNone(Model)) return null;

  return (
    <RangeLoader range={entity.transform}>
      <Model {...pointerProps} />
    </RangeLoader>
  );
};

export const TerrainLoader = ({ terrain }: { terrain: Terrain }) => {
  const model = match(terrain)
    .with({ type: "flat" }, ({ transform: { extend } }) => (
      <Plane
        receiveShadow
        args={[...coord.unwrap(coord.plane.from(extend))]}
        material={new MeshStandardMaterial({ color: "#85B16A" })}
      />
    ))
    .with({ type: "clipping" }, () => null)
    .with({ type: "street" }, ({ variant }) => {
      const Model = findModel({ type: "street", category: "streets", variant });
      if (isNone(Model)) return null;
      return <Model />;
    })
    .exhaustive();

  return (
    <RangeLoader
      plane={false}
      planeProps={terrain.type === "flat"}
      range={terrain.transform}
    >
      {model}
    </RangeLoader>
  );
};
