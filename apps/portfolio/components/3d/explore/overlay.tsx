import { constants } from "@3d/constants";
import { useStore } from "@3d/store";
import { Plane } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh, MeshStandardMaterial } from "three";

const { tileSize, tiles } = constants.world;
const planeSize = tileSize * tiles;

export const ExplorePlane = () => {
  const interaction = useRef<Mesh>(null);
  const [material] = useState(
    () => new MeshStandardMaterial({ transparent: true, opacity: 0 })
  );

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    useStore.getState().updateTarget(e.point);
  };

  return (
    <Plane
      ref={interaction}
      onPointerDown={onPointerDown}
      args={[planeSize, planeSize, 2, 2]}
      rotation={[-Math.PI / 2, 0, 0]}
      material={material}
    />
  );
};
