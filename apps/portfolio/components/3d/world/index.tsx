import { constants } from "@3d/constants";
import { useStore } from "@3d/store";
import { range } from "@components/utils";
import type { FC } from "react";
import { useCallback } from "react";
import { ModelLoader, TerrainLoader } from "./model";

const { tileSize, tiles } = constants.world;

const Tile: FC<{ x: number; z: number }> = ({ x, z }) => {
  const terrain = useStore(useCallback((s) => s.world.terrain[x][z], [x, z]));
  return <TerrainLoader terrain={terrain} />;
};

const Entities = () => {
  const entities = useStore((s) => s.world.entities);
  return (
    <group>
      {entities.map((e) => (
        <ModelLoader key={e.id} entity={e} />
      ))}
    </group>
  );
};

export const World = () => {
  return (
    <group>
      {range(0, tiles).map((x) =>
        range(0, tiles).map((z) => <Tile x={x} z={z} key={`tile-${x}-${z}`} />)
      )}
      <Entities />
    </group>
  );
};
