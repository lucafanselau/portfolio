import { useStore } from "@3d/store";
import { isNone } from "@components/utils";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { PerspectiveCamera as PerspectiveCameraType, Vector3 } from "three";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import { constants } from "./constants";
import { selectors } from "./store/selector";
const targetRange = {
  min: new Vector3(-100, 0, -100),
  max: new Vector3(100, 100, 100),
};

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
    } else {
      // clamp target and copy back to state
      controls.current.target.clamp(targetRange.min, targetRange.max);
      target.copy(controls.current.target);
    }
  }, -2);

  return (
    <group>
      <PerspectiveCamera
        ref={camera}
        makeDefault
        fov={45}
        far={500}
        up={[0, 1, 0]}
      />
      <OrbitControls
        makeDefault
        ref={controls}
        maxPolarAngle={Math.PI / 2 - constants.eps}
        minPolarAngle={Math.PI / 8}
        maxDistance={distance}
        enabled={controlsEnabled}
        enablePan={pan}
        enableZoom={zoom}
        enableRotate={rotate}
        // enableDamping={true}
        regress
      />
    </group>
  );
};
