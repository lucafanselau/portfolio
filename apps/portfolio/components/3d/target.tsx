import { useTexture } from "@react-three/drei";
import { constants } from "./constants";
import { useStore } from "./store";
import { selectors } from "./store/selector";

export const Target = () => {
  const texture = useTexture("/crosshair.png");

  const target = useStore(...selectors.target);
  const visible = useStore(...selectors.ui.open.target);

  return (
    <group position={[0, 2 * constants.eps, 0]} visible={visible}>
      <mesh position={target} renderOrder={999} rotation={[Math.PI / -2, 0, 0]}>
        <planeBufferGeometry args={[1, 1, 1]} />
        <meshStandardMaterial map={texture} transparent />
      </mesh>
    </group>
  );
};
