import { constants } from "@3d/constants";
import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { Plane } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
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
    useStore.getState().setPointer([e.point.x, e.point.z]);
  };
  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    onPointer(e);
    useStore.setState((s) => void (s.pointerDown = true));
    useStore.getState().build("click");
  };
  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    useStore.setState((s) => void (s.pointerDown = false));
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
