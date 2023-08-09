import { constants } from "@3d/constants";
import { useStore } from "@3d/store";
import { range } from "@components/utils";
import { FC, useEffect } from "react";
import { useCallback } from "react";
import { ModelLoader, TerrainLoader } from "./model";

const { tiles } = constants.world;

const Tile: FC<{ x: number; z: number }> = ({ x, z }) => {
  const terrain = useStore(useCallback((s) => s.world.terrain[x][z], [x, z]));
  const props = { terrain, x, z };
  return <TerrainLoader {...props} />;
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
  useEffect(() => {
    // KICK OF STORY LINE
    useStore.getState().updateTools({ type: "focus", key: "info" });
  }, []);

  return (
    <group>
      {range(0, tiles).map((x) =>
        range(0, tiles).map((z) => <Tile x={x} z={z} key={`tile-${x}-${z}`} />)
      )}
      <Entities />
    </group>
  );
};
