import { constants } from "@3d/constants";
import { useStore } from "@3d/store";
import { Plane } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Mesh } from "three";
import { MeshStandardMaterial } from "three";
import { point } from "./utils";

const { tileSize, tiles } = constants.world;
const planeSize = tileSize * tiles;

export const InteractionPlane = () => {
  const interaction = useRef<Mesh>(null);
  const [material] = useState(
    () => new MeshStandardMaterial({ transparent: true, opacity: 0 })
  );

  const onPointer = (e: ThreeEvent<PointerEvent>) => {
    if (!e.point) return;
    useStore.getState().setPointer(point.tile(e.point));
  };
  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    onPointer(e);
    useStore.setState((s) => (s.pointerDown = true));
    useStore.getState().build();
  };
  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    useStore.setState((s) => (s.pointerDown = false));
    onPointer(e);
  };
  return (
    <Plane
      ref={interaction}
      onPointerMove={onPointer}
      onPointerUp={onPointerUp}
      onPointerDown={onPointerDown}
      args={[planeSize, planeSize, 2, 2]}
      rotation={[-Math.PI / 2, 0, 0]}
      material={material}
    />
  );
};
