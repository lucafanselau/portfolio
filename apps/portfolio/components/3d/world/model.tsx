import { mutation } from "@3d/build/mutation";
import { constants } from "@3d/constants";
import { AssetCategory, AssetKey, findAssetEntry } from "@3d/generated-loader";
import { models } from "@3d/generated/loader";
import { isNone, isSome } from "@components/utils";
import { useTexture } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import { ComponentType, FC, forwardRef, useMemo } from "react";
import { mergeRefs } from "react-merge-refs";
import {
  BoxGeometry,
  Group,
  Material,
  MeshStandardMaterial,
  NearestFilter,
} from "three";
import { match } from "ts-pattern";
import { coord } from "./coord";
import { useSlotRef } from "./slots";
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
  { entity: Entity; plane?: boolean; hideable?: boolean;
>(({ entity, plane = true,  hideable = false }, ref) => {
  const slotRef = useSlotRef(entity.id);
  const Model = useMemo(() => findModel(entity), [entity]);
  if (isNone(Model)) return null;

  return (
    <TransformLoader
      scale={hideable ? [0, 0, 0] : undefined}
      ref={mergeRefs([slotRef, ref])}
      id={entity.id}
      transform={entity.transform}
      plane={plane}
    >
      <Model {...mutation.events.model(entity.id)} />
    </TransformLoader>
  );
});

const {
  world: { tileSize, tileHeight },
  eps,
} = constants;

const textures = {
  side: "tile/side.png",
  top: "tile/top.png",
  bottom: "tile/bottom.png",
};

const tileGeometry = new BoxGeometry(
  tileSize * (1 + 50 * eps),
  tileHeight,
  tileSize * (1 + 50 * eps)
);

Object.values(textures).forEach((texture) => useTexture.preload(texture));

const arrangeMaterials = (
  bottom: Material,
  top: Material,
  side: Material
): Material[] => [side, side, top, bottom, side, side];

const TerrainTile: FC<{ top?: boolean }> = ({ top: topEnabled = false }) => {
  const loadedTextures = useTexture(textures);

  const tileMaterials = useMemo(() => {
    Object.values(loadedTextures).forEach(
      (texture) => (texture.magFilter = NearestFilter)
    );

    const side = new MeshStandardMaterial({
      map: loadedTextures.side,
      roughness: 1,
    });
    const top = new MeshStandardMaterial({
      map: loadedTextures.top,
      roughness: 1,
    });
    const bottom = new MeshStandardMaterial({ map: loadedTextures.bottom });
    const invisible = new MeshStandardMaterial({ visible: false });
    return arrangeMaterials(bottom, topEnabled ? top : invisible, side);
  }, [loadedTextures, topEnabled]);

  return (
    <mesh
      geometry={tileGeometry}
      position={[0, -tileHeight / 2 - constants.eps, 0]}
      material={tileMaterials}
      receiveShadow
    />
  );
};

type TerrainLoaderProps = {
  terrain: Terrain;
  x: number;
  z: number;
};

export const TerrainLoader = ({ terrain, x, z }: TerrainLoaderProps) => {
  const model = match(terrain)
    .with({ type: "flat" }, () => <TerrainTile top />)
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

  const slotRef = useSlotRef(terrain.id);

  return (
    <TransformLoader
      scale={[0, 0, 0]}
      ref={slotRef}
      // Create interaction plane
      plane={terrain.type === "street"}
      transform={transform}
      id={terrain.type === "street" ? terrain.id : `tile-${x}-${z}`}
    >
      {model}
    </TransformLoader>
  );
};
