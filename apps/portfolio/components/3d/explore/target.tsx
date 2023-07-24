import { constants } from "@3d/constants";
import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Mesh } from "three";

export const ExploreTarget = () => {
  const texture = useTexture("/crosshair.png");

  const ref = useRef<Mesh>(null);
  useEffect(
    () =>
      useStore.subscribe(
        selectors.target[0],
        (target) => ref.current?.position.copy(target),
        { equalityFn: (a, b) => a.equals(b) }
      ),
    []
  );
  const visible = useStore(...selectors.ui.open.target);

  return (
    <group position={[0, 2 * constants.eps, 0]} visible={visible}>
      <mesh ref={ref} renderOrder={999} rotation={[Math.PI / -2, 0, 0]}>
        <planeBufferGeometry args={[1, 1, 1]} />
        <meshStandardMaterial map={texture} transparent />
      </mesh>
    </group>
  );
};
