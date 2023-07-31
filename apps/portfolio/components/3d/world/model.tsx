import { mutation } from "@3d/build/mutation";
import { BuildPreviewPlane } from "@3d/build/overlay";
import { constants } from "@3d/constants";
import { AssetCategory, AssetKey, findAssetEntry } from "@3d/generated-loader";
import { models } from "@3d/generated/loader";
import { useStore } from "@3d/store";
import { isNone, isSome } from "@components/utils";
import { Slot } from "@radix-ui/react-slot";
import { Plane } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import {
  ComponentProps,
  ComponentType,
  forwardRef,
  ReactNode,
  useMemo,
} from "react";
import { Group, MeshStandardMaterial } from "three";
import { match } from "ts-pattern";
import { coord, Transform } from "./coord";
import { TransformLoader } from "./transform";
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

export const ModelLoader = forwardRef<
  Group,
  { entity: Entity<AssetCategory>; plane?: boolean }
>(({ entity, plane = true }, ref) => {
  const Model = useMemo(() => findModel(entity), [entity]);
  if (isNone(Model)) return null;

  return (
    <TransformLoader
      ref={ref}
      id={entity.id}
      transform={entity.transform}
      plane={plane}
    >
      <Model {...mutation.events.model(entity.id)} />
    </TransformLoader>
  );
});

const {
  world: { tileSize },
} = constants;

export const TerrainLoader = ({
  terrain,
  x,
  z,
}: {
  terrain: Terrain;
  x: number;
  z: number;
}) => {
  const model = match(terrain)
    .with({ type: "flat" }, () => (
      <Plane
        receiveShadow
        args={[tileSize, tileSize]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, constants.eps, 0]}
        material={new MeshStandardMaterial({ color: "#85B16A" })}
      />
    ))
    .with({ type: "clipping" }, () => null)
    .with({ type: "street" }, ({ variant, id }) => {
      const Model = findModel({ type: "street", category: "streets", variant });
      if (isNone(Model)) return null;
      return <Model {...mutation.events.model(id)} />;
    })
    .exhaustive();

  // for terrain we can ignore rotation alignment since the center is always the same
  const transform = coord.transform.create(
    coord.tile.create(x + 0.5, z + 0.5),
    [1, 1],
    terrain.type === "street" ? terrain.rotation : 0
  );

  return (
    <TransformLoader
      // Create interaction plane
      plane={terrain.type === "street"}
      transform={transform}
      id={terrain.type === "street" ? terrain.id : `tile-${x}-${z}`}
    >
      {model}
    </TransformLoader>
  );
};
