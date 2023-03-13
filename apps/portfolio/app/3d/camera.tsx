import { State, useStore } from "@3d/store";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useRef } from "react";
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

  const state = useStore((s) => s.state);
  const target = useStore(
    (s) => positions[s.state],
    (a, b) => a.equals(b)
  );

  useFrame((_, delta) => {
    if (state !== "start") return;
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
        far={500}
      />
      <OrbitControls
        makeDefault
        onChange={console.log}
        enabled={state === "explore"}
      />
    </group>
  );
};
