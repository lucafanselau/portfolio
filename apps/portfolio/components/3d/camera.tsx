import { useStore } from "@3d/store";
import { isNone } from "@components/utils";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { PerspectiveCamera as PerspectiveCameraType } from "three";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import { constants } from "./constants";
import { selectors } from "./store/selector";

export const Camera = () => {
  const { zoom, pan, rotate, distance, controlsEnabled } = useStore(
    ...selectors.camera
  );
  const controls = useRef<OrbitControlsType | null>(null);
  const camera = useRef<PerspectiveCameraType>(null);

  useFrame(() => {
    if (isNone(camera.current) || isNone(controls.current)) return;
    const {
      camera: { target, position, controlled },
    } = useStore.getState();

    // This is a two way system. Dependent on the flags in the controlled objects we either copy the
    // values from the camera to the store or from the store to the camera.

    if (controlled.position) camera.current.position.copy(position);
    else position.copy(camera.current.position);

    if (controlled.target) {
      controls.current.target.copy(target);
      camera.current.lookAt(target.x, target.y, target.z);
    } else target.copy(controls.current.target);
  }, -2);

  return (
    <group>
      <PerspectiveCamera ref={camera} makeDefault fov={45} far={500} />
      <OrbitControls
        makeDefault
        ref={controls}
        maxPolarAngle={Math.PI / 2 - constants.eps}
        maxDistance={distance}
        enabled={controlsEnabled}
        enablePan={pan}
        enableZoom={zoom}
        enableRotate={rotate}
        enableDamping={false}
      />
    </group>
  );
};
