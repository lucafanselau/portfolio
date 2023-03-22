import { constants } from "@3d/constants";
import { Plane } from "@react-three/drei";
import { forwardRef, useMemo, useRef, useState } from "react";
import { Mesh, MeshStandardMaterial } from "three";
import { useToolsStore } from "./store";
import TileLoader from "@3d/world/tile";
import { TerrainType } from "../types";
import { normalizeTile } from "..";
import { green } from "tailwindcss/colors";
import { buildStreet, destroyStreet } from "./mutation";
import {
  GroupProps,
  MeshProps,
  ThreeEvent,
  useFrame,
} from "@react-three/fiber";

const { tileSize, tiles } = constants.world;
const planeSize = tileSize * tiles;

const toTile = (x: number) => {
  return Math.floor(x / tileSize) + tiles / 2;
};

const Overlay = forwardRef<Mesh, MeshProps>(({ ...props }, ref) => {
  const [material] = useState(
    () =>
      new MeshStandardMaterial({
        color: green[800],
        depthTest: false,
        transparent: true,
        opacity: 0.5,
      })
  );
  return (
    <Plane
      {...props}
      ref={ref}
      args={[tileSize, tileSize, 2, 2]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      material={material}
    />
  );
});

export const ToolsOverlay = () => {
  const type = useToolsStore((s) => s.state?.type);

  const [material] = useState(
    () => new MeshStandardMaterial({ transparent: true, opacity: 0 })
  );

  const interaction = useRef<Mesh>();
  const overlay = useRef<Mesh>(null);

  useFrame(() => {
    if (!type || !interaction.current || !overlay.current) return;

    const { point } = useToolsStore.getState();
    if (!point) return;
    const [x, z] = point.map((x) => normalizeTile(toTile(x)));
    overlay.current.position.set(x, 0, z);
  });

  const onPointer = (e: ThreeEvent<PointerEvent>) => {
    const { x, z } = e.point;
    useToolsStore.setState({ point: [x, z] });
  };

  const onClick = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const { point } = useToolsStore.getState();
    if (!point) return;
    const [x, z] = [toTile(point[0]), toTile(point[1])];
    if (type === "build") buildStreet(x, z);
    else if (type === "destroy") destroyStreet(x, z);
  };

  if (type === undefined) return null;

  return (
    <group renderOrder={9999} position={[0, -1 * constants.eps, 0]}>
      <Plane
        ref={interaction}
        onPointerMove={onPointer}
        onPointerEnter={onPointer}
        onPointerLeave={onPointer}
        onPointerDown={onClick}
        args={[planeSize, planeSize, 2, 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={material}
      />
      <Overlay ref={overlay} />
    </group>
  );
};
