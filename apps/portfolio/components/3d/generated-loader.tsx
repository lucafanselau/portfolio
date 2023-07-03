import collection from "@3d/generated/collection.json";
import { Instances } from "@3d/generated/index";
import { FC, ReactNode, useMemo } from "react";
import { constants, Unwrap } from "./constants";
import { models } from "@3d/generated/loader";
import { useStore } from "@3d/store";
import { isNone } from "@components/utils";
import { Building } from "./world/types";

type GeneratedKeys = keyof typeof collection;
type GeneratedEntry<Keys extends GeneratedKeys = GeneratedKeys> = Unwrap<
  (typeof collection)[Keys]
>;

export const GeneratedLoader: FC<{ children?: ReactNode }> = ({ children }) => {
  return <Instances>{children}</Instances>;
};

export const BuildingLoader: FC<Building> = ({
  type,
  rotation: rot,
  position,
}) => {
  const entry = useMemo(
    () => collection["buildings"].find((e) => e.id === type),
    [type]
  );

  const Model = models["buildings"]?.[type];
  if (isNone(Model)) return null;

  const { rotation, ...props } = useMemo(() => {
    const [width, depth] = entry?.extend ?? [1, 1];
    const { tileSize } = constants.world;
    return {
      position: [(width / 2) * tileSize, 0, (depth / 2) * tileSize] as const,
      rotation: [0, (rot * Math.PI) / 2, 0] as [number, number, number],
    };
  }, [type, rot]);

  return (
    <group position={position}>
      <group rotation={rotation}>
        <Model {...props} />
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
