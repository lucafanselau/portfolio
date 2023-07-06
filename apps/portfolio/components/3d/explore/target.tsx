import { constants } from "@3d/constants";
import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { useTexture } from "@react-three/drei";

export const ExploreTarget = () => {
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
