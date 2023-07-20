import { constants } from "@3d/constants";
import { useStore } from "@3d/store";
import { coord } from "@3d/world/coord";
import { Plane } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Mesh } from "three";
import { MeshStandardMaterial } from "three";

const { tileSize, tiles } = constants.world;
const planeSize = tileSize * tiles;

export const InteractionPlane = () => {
  const interaction = useRef<Mesh>(null);
  const [material] = useState(
    () => new MeshStandardMaterial({ transparent: true, opacity: 0 })
  );

  const onPointer = (e: ThreeEvent<PointerEvent>) => {
    if (!e.point) return;
    useStore.getState().setPointer(coord.world.create(e.point.x, e.point.z));
  };
  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    onPointer(e);
    useStore.setState((s) => void (s.pointerDown = true));
    useStore.getState().build();
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

// ******************************************************
// REUSABLE

const colors = {
  red: "#ef4444",
  green: "#10b981",
  blue: "#3b82f6",
};
type Color = keyof typeof colors;

export const BuildPreviewPlane = forwardRef<
  Mesh,
  ComponentPropsWithoutRef<typeof Plane> & {
    depthTest?: boolean;
    color?: Color;
  }
>(({ depthTest = false, color = "blue", ...props }, ref) => {
  const [material] = useState(
    () =>
      new MeshStandardMaterial({
        depthTest,
        transparent: true,
        opacity: 0.5,
      })
  );

  useEffect(() => {
    material.color.set(colors[color]);
  }, [color]);

  return <Plane {...props} ref={ref} receiveShadow material={material} />;
});
