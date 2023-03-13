import { Plane } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import { FC, memo } from "react";
import { match } from "ts-pattern";
import { TerrainType } from "./types";

import { Model as StreetEnd } from "@3d/generated/streets/street-end";
import { Model as StreetStraight } from "@3d/generated/streets/street-straight";
import { Model as StreetTurn } from "@3d/generated/streets/street-turn";
import { Model as StreetThree } from "@3d/generated/streets/street-three";
import { Model as StreetFour } from "@3d/generated/streets/street-four";
import { useStore } from "@3d/store";
import { Vector3 } from "three";

const onClick: GroupProps["onClick"] = ({ point, ...e }) => {
  const state = useStore.getState().state;
  if (state !== "explore") return;
  // console.log(point, e);
  e.stopPropagation();
  useStore.setState({ target: new Vector3().set(point.x, 0, point.z) });
};

const TileLoader: FC<{ tile: TerrainType } & GroupProps> = ({
  tile,
  ...rest
}) => {
  const props = { ...rest, onClick };
  return match(tile)
    .with(TerrainType.Flat, () => (
      <group {...props}>
        <Plane
          rotation={[-Math.PI / 2, 0, 0]}
          args={[8, 8, 4, 4]}
          material-color={"#85B16A"}
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
};

export default memo(TileLoader);
