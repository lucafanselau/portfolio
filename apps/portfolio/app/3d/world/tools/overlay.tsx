import { constants } from "@3d/constants";
import { Plane } from "@react-three/drei";
import { useMemo, useState } from "react";
import { MeshStandardMaterial } from "three";
import { useToolsStore } from "./store";
import TileLoader from "@3d/world/tile";
import { TerrainType } from "../types";
import { normalizeTile } from "..";
import { green } from "tailwindcss/colors";
import { buildStreet } from "./street";
import { GroupProps } from "@react-three/fiber";

const { tileSize, tiles } = constants.world;
const planeSize = tileSize * tiles;

const toTile = (x: number | undefined) => {
  if (x === undefined) return undefined;
  return Math.floor(x / tileSize) + tiles / 2;
};

const StreetOverlay = () => {
  const x = useToolsStore((state) => toTile(state.point?.[0]));
  const z = useToolsStore((state) => toTile(state.point?.[1]));

  const position = useMemo(() => {
    if (!x || !z) return [0, 0, 0] as const;
    // floor coordinates to nearest tile
    return [normalizeTile(x), 0, normalizeTile(z)] as const;
  }, [x, z]);

  const [material] = useState(
    () => new MeshStandardMaterial({ color: green[800], depthTest: false })
  );

  const onBuild: GroupProps["onClick"] = (e) => {
    e.stopPropagation();
    if (!x || !z) return;
    buildStreet(x, z);
  };

  return (
    <Plane
      position={position}
      args={[tileSize, tileSize, 2, 2]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      onClick={onBuild}
      material={material}
    />
  );
};

export const ToolsOverlay = () => {
  const type = useToolsStore((s) => s.state?.type);

  const [material] = useState(
    () => new MeshStandardMaterial({ transparent: true, opacity: 0 })
  );

  if (type === undefined) return null;

  return (
    <group renderOrder={9999} position={[0, constants.eps * 4, 0]}>
      <Plane
        position={[0, 1, 0]}
        onPointerMove={(e) => {
          const { x, z } = e.point;
          useToolsStore.setState({ point: [x, z] });
        }}
        args={[planeSize, planeSize, 2, 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={material}
      />
      <StreetOverlay />
    </group>
  );
};
