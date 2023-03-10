import { State, useStore } from "@3d/store";
import { PerspectiveCamera } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useEffect, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import { constants } from "./constants";
import { useRetainedTransform } from "./utils";

const positions: Record<State, Vector3> = {
  start: new Vector3(
    0,
    constants.guy.approximateHeight * 1.5,
    constants.camera.distance
  ),
  explore: new Vector3(
    0,
    constants.guy.approximateHeight * 6,
    constants.camera.distance
  ),
  "top-level": new Vector3(
    0,
    constants.guy.approximateHeight * 1.5,
    constants.camera.distance
  ),
};

export const Camera = () => {
  const camera = useThree((s) => s.camera);
  const guy = useStore((s) => s.slots.guy);
  const retained = useRef<Group>(null);

  useRetainedTransform("camera", retained, guy);

  const target = useStore(
    (s) => positions[s.state],
    (a, b) => a.equals(b)
  );

  useFrame((_, delta) => {
    easing.damp3(camera.position, target, 0.1, delta, 10);
    if (camera && guy)
      camera.lookAt(
        guy.position.x,
        constants.guy.approximateHeight,
        guy.position.z
      );
  });

  return (
    <group ref={retained}>
      <PerspectiveCamera
        makeDefault
        position={[
          0,
          constants.guy.approximateHeight * 1.5,
          constants.camera.distance,
        ]}
        fov={45}
      />
    </group>
  );
};
