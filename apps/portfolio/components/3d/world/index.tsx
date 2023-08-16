import { constants } from "@3d/constants";
import { useStore } from "@3d/store";
import { range } from "@components/utils";
import { FC, useCallback, useEffect } from "react";
import { ModelLoader, TerrainLoader } from "./model";

const { tiles } = constants.world;

const Tile: FC<{ x: number; z: number; index: number }> = ({ x, z, index }) => {
  const terrain = useStore(useCallback((s) => s.world.terrain[x][z], [x, z]));

  const distanceToCenter = Math.floor(
    Math.sqrt((x - tiles / 2) ** 2 + (z - tiles / 2) ** 2)
  );
  const props = { terrain, x, z, delay: distanceToCenter * 400 };
  return <TerrainLoader {...props} />;
};

const Entities = () => {
  const entities = useStore((s) => s.world.entities);
  return (
    <group>
      {entities.map((e, i) => (
        <ModelLoader key={e.id} entity={e} delay={500 + i * 500} />
      ))}
    </group>
  );
};

export const World = () => {
  useEffect(() => {
    // KICK OF STORY LINE
    useStore.getState().updateState("start"); //   updateTools({ type: "focus", key: "info" });
  }, []);

  return (
    <group>
      {range(0, tiles)
        .flatMap((x) => range(0, tiles).map((z) => ({ x, z })))
        .map(({ x, z }, index) => (
          <Tile index={index} x={x} z={z} key={`tile-${x}-${z}`} />
        ))}
      <Entities />
    </group>
  );
};
