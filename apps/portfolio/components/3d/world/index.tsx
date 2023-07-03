import { range } from "@components/utils";
import { constants } from "@3d/constants";
import { useStore } from "@3d/store";
import { FC, useCallback, useMemo } from "react";
import { Buildings, Props } from "@3d/generated-loader";
import { Interactions } from "./interactions";
import TileLoader from "./tile";

const { tileSize, tiles } = constants.world;

export const normalizeTile = (x: number) =>
  (x - tiles / 2) * tileSize + tileSize / 2;

const Tile: FC<{ x: number; z: number }> = ({ x, z }) => {
  const type = useStore(useCallback((s) => s.world.terrain[x][z][0], [x, z]));
  const rot = useStore(useCallback((s) => s.world.terrain[x][z][1], [x, z]));
  const position = useMemo(
    () => [normalizeTile(x), 0, normalizeTile(z)] as [number, number, number],
    [x, z]
  );
  const rotation = useMemo(
    () => [0, rot * (Math.PI / 2), 0] as [number, number, number],
    [rot]
  );
  return (
    <group position={position} rotation={rotation}>
      <TileLoader tile={type} />
    </group>
  );
};

export const World = () => {
  return (
    <group>
      {range(0, tiles).map((x) =>
        range(0, tiles).map((z) => <Tile x={x} z={z} key={`tile-${x}-${z}`} />)
      )}
      <Buildings />
      <Props />
      <Interactions />
    </group>
  );
};
