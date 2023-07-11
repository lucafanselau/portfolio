import collection from "@3d/generated/collection.json";
// import { Instances } from "@3d/generated/index";
import { models } from "@3d/generated/loader";
import { useStore } from "@3d/store";
import { isNone } from "@components/utils";
import type { GroupProps } from "@react-three/fiber";
import type { FC, ReactNode } from "react";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import { BuildPreviewPlane } from "./build/preview";
import { constants } from "./constants";
import type { Building, Prop } from "./world/types";

// TODO: coord rework
// in total i don't like this file here

// ***************************************************
// Collection and Assets types and helpers

export type AssetCollection = typeof collection;
export type AssetCategory = keyof AssetCollection;
export type AssetEntry<Keys extends AssetCategory = AssetCategory> =
  UnwrapUnion<AssetCollection[Keys]>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
type UnwrapUnion<T> = T extends T ? T[keyof T] : never;
export const findAssetEntry = <C extends AssetCategory>(
  category: C,
  item: KeysOfUnion<AssetCollection[C]>
) => {
  return collection[category][item] as AssetEntry<C>;
};
export const defaultStreetsEntry = {
  ...findAssetEntry("streets", "street-four"),
  name: "Standard Street",
};

// ***************************************************
// Model Loaders

export const GeneratedLoader: FC<{ children?: ReactNode }> = ({ children }) => {
  // NOTE: currently instances are turned off
  return <>{children}</>;
  // return <Instances>{children}</Instances>;
};

export const BuildingLoader: FC<Building & { plane?: boolean }> = ({
  type,
  rotation: rot,
  position,
  plane = true,
}) => {
  const ref = useRef<Group>(null);
  const entry = useMemo(() => findAssetEntry("buildings", type), [type]);

  const Model = models.buildings[type];

  const { rotation, args, ...props } = useMemo((): Omit<GroupProps, "args"> & {
    args: [number, number];
  } => {
    const { tileSize } = constants.world;
    const [width, depth] = entry.extend ?? [1, 1];

    return {
      position: [
        (width / 2) * tileSize,
        constants.eps,
        (depth / 2) * tileSize,
      ] as const,
      rotation: [0, (rot * Math.PI) / 2, 0] as [number, number, number],
      onPointerOver: (e) =>
        useStore.setState((s) => void s.world.hovered.push(e.object)),
      onPointerOut: (e) =>
        useStore.setState(
          (s) =>
            void (s.world.hovered = s.world.hovered.filter(
              (h) => h !== e.object
            ))
        ),
      args: [tileSize * width, tileSize * depth],
    };
  }, [type, rot, position]);

  if (isNone(Model)) return null;
  return (
    <group position={position}>
      <group rotation={rotation}>
        <Model ref={ref} {...props} />
        {plane ? (
          <BuildPreviewPlane
            depthTest
            args={args}
            color="red"
            position={props.position}
          />
        ) : null}
      </group>
    </group>
  );
};

export const Buildings = () => {
  const buildings = useStore((state) => state.world.buildings);

  return (
    <>
      {buildings.map((building) => (
        <BuildingLoader key={building.id} {...building} />
      ))}
    </>
  );
};

export const PropLoader: FC<Prop> = ({ type, rotation, position }) => {
  const Model = models.props[type];

  const ref = useRef<Group>(null);
  const props = useMemo(
    (): GroupProps => ({
      onPointerOver: (e) =>
        useStore.setState((s) => void s.world.hovered.push(e.object)),
      onPointerOut: (e) =>
        useStore.setState(
          (s) =>
            void (s.world.hovered = s.world.hovered.filter(
              (h) => h !== e.object
            ))
        ),
    }),
    [ref]
  );

  if (isNone(Model)) return null;
  return (
    <Model
      {...props}
      position={position}
      rotation={[0, (rotation * Math.PI) / 2, 0]}
    />
  );
};

export const Props = () => {
  const props = useStore((state) => state.world.props);

  return (
    <>
      {props.map((prop) => (
        <PropLoader key={prop.id} {...prop} />
      ))}
    </>
  );
};
