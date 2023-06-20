import { memo, useMemo } from "react";
import { match } from "ts-pattern";
import { Building, BuildingType, getBuildingSize } from "../types";
import { useStore } from "@3d/store";
import { constants } from "@3d/constants";

import { Model as School } from "@3d/generated/buildings/school";
import { Model as Office } from "@3d/generated/buildings/office";
import { Model as House } from "@3d/generated/buildings/house";
import { Model as Tree1 } from "@3d/generated/buildings/tree1";
import { Model as Tree2 } from "@3d/generated/buildings/tree2";
import { Model as Tree3 } from "@3d/generated/buildings/tree3";
import { Model as Tree4 } from "@3d/generated/buildings/tree4";

const { tileSize } = constants.world;

export const BuildingLoader = memo(
  ({ type, position, rotation: rot }: Building) => {
    const { rotation, ...props } = useMemo(() => {
      const [width, depth] = getBuildingSize(type);
      return {
        position: [(width / 2) * tileSize, 0, (depth / 2) * tileSize] as const,
        rotation: [0, (rot * Math.PI) / 2, 0] as [number, number, number],
      };
    }, [type, rot]);

    const building = match(type)
      .with(BuildingType.School, () => <School {...props} />)
      .with(BuildingType.Office, () => <Office {...props} />)
      .with(BuildingType.House, () => <House {...props} />)
      .with(BuildingType.Tree1, () => <Tree1 {...props} />)
      .with(BuildingType.Tree2, () => <Tree2 {...props} />)
      .with(BuildingType.Tree3, () => <Tree3 {...props} />)
      .with(BuildingType.Tree4, () => <Tree4 {...props} />)
      .otherwise(() => null);

    return (
      <group position={position}>
        <group rotation={rotation}>{building}</group>
      </group>
    );
  }
);

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
