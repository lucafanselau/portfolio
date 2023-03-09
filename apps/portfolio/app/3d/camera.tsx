import { useStore } from "@3d/store";
import { PerspectiveCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Group } from "three";
import { constants } from "./constants";
import { useRetainedTransform } from "./utils";

export const Camera = () => {
  const camera = useThree((s) => s.camera);
  const guy = useStore((s) => s.slots.guy);
  const retained = useRef<Group>(null);

  useRetainedTransform("camera", retained, guy);

  useEffect(() => {
    if (camera) camera.lookAt(0, constants.guy.approximateHeight, 0);
  }, [camera]);

  return (
    <group ref={retained}>
      <PerspectiveCamera
        makeDefault
        // position={[distance * Math.SQRT2, approxHeight * 2, distance * Math.SQRT2]}
        position={[
          0,
          constants.guy.approximateHeight * 2,
          constants.camera.distance,
        ]}
        fov={45}
      />
    </group>
  );
};
