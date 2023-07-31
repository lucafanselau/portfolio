import { constants } from "@3d/constants";
import { useStore } from "@3d/store";
import { Plane } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh, MeshStandardMaterial } from "three";

const { tileSize, tiles } = constants.world;
const planeSize = tileSize * tiles;

const approxEq = (a: number, b: number) => Math.abs(a - b) < 10;

export const ExplorePlane = () => {
  const interaction = useRef<Mesh>(null);
  const ref = useRef<[number, number] | null>(null);
  const [material] = useState(
    () => new MeshStandardMaterial({ transparent: true, opacity: 0 })
  );

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    ref.current = [e.clientX, e.clientY];
  };

  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!ref.current) return;
    const [x, y] = ref.current;
    const [x2, y2] = [e.clientX, e.clientY];
    if (approxEq(x, x2) && approxEq(y, y2)) {
      useStore.getState().updateTarget(e.point);
    }
    ref.current = null;
  };

  return (
    <Plane
      ref={interaction}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      args={[planeSize, planeSize, 2, 2]}
      rotation={[-Math.PI / 2, 0, 0]}
      material={material}
    />
  );
};
