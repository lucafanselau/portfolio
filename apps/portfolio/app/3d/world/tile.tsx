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

const TileLoader: FC<{ tile: TerrainType } & GroupProps> = ({
  tile,
  ...props
}) => {
  return match(tile)
    .with(TerrainType.Flat, () => (
      <Plane
        rotation={[-Math.PI / 2, 0, 0]}
        args={[8, 8, 4, 4]}
        material-color={"#85B16A"}
        {...props}
      />
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
