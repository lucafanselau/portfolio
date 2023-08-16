import { mutation } from "@3d/build/mutation";
import { constants } from "@3d/constants";
import { AssetCategory, AssetKey, findAssetEntry } from "@3d/generated-loader";
import { models } from "@3d/generated/loader";
import { transitionVector3 } from "@3d/transition";
import { isNone, isSome } from "@components/utils";
import { useTexture } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import {
  ComponentType,
  FC,
  forwardRef,
  Ref,
  RefObject,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  BoxGeometry,
  Group,
  Material,
  MeshStandardMaterial,
  NearestFilter,
  Vector3,
} from "three";
import { match } from "ts-pattern";
import { coord } from "./coord";
import { TransformLoader } from "./transform";
import { Entity, Terrain } from "./types";
import { mergeRefs } from "react-merge-refs";
const ZERO = new Vector3(0, 0, 0),
  ONE = new Vector3(1, 1, 1);

const useShown = (
  ref: RefObject<Group>,
  shown: boolean,
  delay?: number,
  smoothTime?: number
) => {
  useEffect(() => {
    if (ref.current && !shown) ref.current.scale.setScalar(0);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (ref.current) {
        let target;
        if (shown) target = ONE;
        else target = ZERO;
        transitionVector3(
          ref.current.scale,
          target,
          isSome(smoothTime) ? { smoothTime } : undefined
        ).catch(console.error);
      }
    }, delay ?? 0);
    return () => clearTimeout(timeout);
  }, [shown, delay]);
};

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
  { entity: Entity; plane?: boolean; delay?: number }
>(({ entity, plane = true, delay }, ref) => {
  const Model = useMemo(() => findModel(entity), [entity]);
  if (isNone(Model)) return null;

  const shownRef = useRef<Group>(null);
  useShown(shownRef, isNone(entity.hidden) || !entity.hidden, delay);

  return (
    <TransformLoader
      ref={mergeRefs([shownRef, ref])}
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
  delay?: number;
};

export const TerrainLoader = ({ terrain, x, z, delay }: TerrainLoaderProps) => {
  const ref = useRef<Group>(null);
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

  useShown(ref, terrain.shown, delay, 0.5);

  return (
    <TransformLoader
      ref={ref}
      // Create interaction plane
      plane={terrain.type === "street"}
      transform={transform}
      id={terrain.type === "street" ? terrain.id : `tile-${x}-${z}`}
    >
      {model}
    </TransformLoader>
  );
};
