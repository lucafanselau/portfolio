import { constants } from "@3d/constants";
import { useStore } from "@3d/store";
import { useNonDragClick } from "@components/hooks/use-non-drag-click";
import { Plane } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh, MeshStandardMaterial } from "three";

const { tileSize, tiles } = constants.world;
const planeSize = tileSize * tiles;

export const ExplorePlane = () => {
  const interaction = useRef<Mesh>(null);
  const ref = useRef<[number, number] | null>(null);
  const [material] = useState(
    () => new MeshStandardMaterial({ transparent: true, opacity: 0 })
  );

  const pointer = useNonDragClick<ThreeEvent<PointerEvent>>((e) => {
    useStore.getState().updateTarget(e.point);
  });

  return (
    <Plane
      ref={interaction}
      {...pointer}
      args={[planeSize, planeSize, 2, 2]}
      rotation={[-Math.PI / 2, 0, 0]}
      material={material}
    />
  );
};
