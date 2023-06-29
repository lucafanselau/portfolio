import { Box, Plane } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import { FC, forwardRef, memo } from "react";
import { match } from "ts-pattern";
import { TerrainType } from "./types";

import { Model as StreetEnd } from "@3d/generated/streets/street-end";
import { Model as StreetStraight } from "@3d/generated/streets/street-straight";
import { Model as StreetTurn } from "@3d/generated/streets/street-turn";
import { Model as StreetThree } from "@3d/generated/streets/street-three";
import { Model as StreetFour } from "@3d/generated/streets/street-four";
import { useStore } from "@3d/store";
import { Group, MeshStandardMaterial, Vector3 } from "three";
import { constants } from "@3d/constants";

const onClick: GroupProps["onClick"] = ({ point, ...e }) => {
  const state = useStore.getState().state;
  if (state !== "explore") return;
  const { min, max } = constants.world.moveScope;
  e.stopPropagation();
  const target = new Vector3().set(point.x, 0, point.z).clamp(min, max);
  useStore.getState().updateTarget(target);
};

const TileLoader = forwardRef<Group, { tile: TerrainType } & GroupProps>(
  ({ tile, ...rest }, ref) => {
    const props = { ...rest, onClick };
    return match(tile)
      .with(TerrainType.Flat, () => (
        <group ref={ref} {...props}>
          <Box
            position={[0, -0.05, 0]}
            receiveShadow
            args={[8, 0.1, 8, 4, 4]}
            material={new MeshStandardMaterial({ color: "#85B16A" })}
          />
        </group>
      ))
      .with(TerrainType.Clipping, () => null)
      .with(TerrainType.StreetEnd, () => <StreetEnd {...props} />)
      .with(TerrainType.StreetStraight, () => <StreetStraight {...props} />)
      .with(TerrainType.StreetTurn, () => <StreetTurn {...props} />)
      .with(TerrainType.StreetThree, () => <StreetThree {...props} />)
      .with(TerrainType.StreetFour, () => <StreetFour {...props} />)
      .otherwise(() => null);
  }
);

export default TileLoader;
