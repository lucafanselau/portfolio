import { useStore } from "@3d/store";
import { range } from "@/utils";
import { FC, useCallback, useMemo } from "react";
import TileLoader from "./tile";
import { constants } from "@3d/constants";
import { Instances } from "@3d/generated";

const { tileSize, tiles } = constants.world;

const norm = (x: number) => (x - tiles / 2) * tileSize + tileSize / 2;

const Tile: FC<{ x: number; z: number }> = ({ x, z }) => {
  const type = useStore(useCallback((s) => s.world.terrain[x][z][0], [x, z]));
  const rot = useStore(useCallback((s) => s.world.terrain[x][z][1], [x, z]));
  const position = useMemo(
    () => [norm(x), 0, norm(z)] as [number, number, number],
    [x, z]
  );
  const rotation = useMemo(
    () => [0, rot * (Math.PI / 2), 0] as [number, number, number],
    [rot]
  );
  return (
    <group position={position} rotation={rotation}>
      <TileLoader tile={type} />;
    </group>
  );
};

export const World = () => {
  return (
    <Instances>
      <group>
        {range(0, tiles).map((x) =>
          range(0, tiles).map((z) => (
            <Tile x={x} z={z} key={`tile-${x}-${z}`} />
          ))
        )}
      </group>
    </Instances>
  );
};
