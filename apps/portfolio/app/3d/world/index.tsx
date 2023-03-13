import { useStore } from "@3d/store";
import { range } from "@/utils";
import { FC, useCallback, useMemo } from "react";
import TileLoader from "./tile";
import { constants } from "@3d/constants";
import { Instances } from "@3d/generated";

const { tileSize, tiles } = constants.world;

const norm = (x: number) => (x - tiles / 2) * tileSize;

const Tile: FC<{ x: number; z: number }> = ({ x, z }) => {
  const type = useStore(useCallback((s) => s.world.terrain[x][z], [x, z]));
  const position = useMemo(() => [norm(x), 0, norm(z)], [x, z]);
  return <TileLoader tile={type} position={position} />;
};

export const World = () => {
  return (
    <Instances>
      <group>
        {range(0, tiles).map((x) =>
          range(0, tiles).map((z) => <Tile x={x} z={z} />)
        )}
      </group>
    </Instances>
  );
};
