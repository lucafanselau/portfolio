import collection from "@3d/generated/collection.json";
// import { Instances } from "@3d/generated/index";
import { models } from "@3d/generated/loader";
import { useStore } from "@3d/store";
import { isNone } from "@components/utils";
import type { GroupProps } from "@react-three/fiber";
import type { FC, ReactNode } from "react";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import { BuildPreviewPlane } from "@3d/build/preview";
import { constants } from "@3d/constants";
import type { Building, Prop } from "@3d/world/types";
import { findAssetEntry } from "@3d/generated-loader";
import { coord } from "./coord";

const pointerProps: GroupProps = {
  onPointerOver: (e) =>
    useStore.setState((s) => void s.world.hovered.push(e.object)),
  onPointerOut: (e) =>
    useStore.setState(
      (s) =>
        void (s.world.hovered = s.world.hovered.filter((h) => h !== e.object))
    ),
};

export const BuildingLoader: FC<Building> = ({ type, range }) => {
  const ref = useRef<Group>(null);
  const Model = models.buildings[type];

  const { plane, wrapper, rotation, model } = coord.objects.building(range);
  if (isNone(Model)) return null;
  return (
    <group {...wrapper}>
      <group {...rotation}>
        <BuildPreviewPlane {...plane} />
        <Model {...model} />
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
