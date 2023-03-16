import { State, useStore } from "@3d/store";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useEffect, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import { OrbitControls as OrbitControlsType } from "three-stdlib";
import { constants } from "./constants";
import { useRetainedTransform } from "./utils";

export const cameraTargets: Record<State, Vector3> = {
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
  const setSlot = useStore((state) => state.setSlot);
  const retained = useRef<Group>(null);

  const guy = useStore((state) => state.slots.guy);

  /* useRetainedTransform("camera", retained, guy); */

  const state = useStore((s) => s.state);
  /* const target = useStore(
   *   (s) => positions[s.state],
   *   (a, b) => a.equals(b)
   * ); */

  const camera = useStore((s) => s.slots.camera);

  useEffect(() => {
    const guy = useStore.getState().slots.guy;
    camera?.lookAt(
      guy?.position.x ?? 0,
      constants.guy.approximateHeight,
      guy?.position.z ?? 0
    );
  }, [camera]);

  const orbit = useRef<OrbitControlsType>(null);

  /* const [target] = useState(new Vector3()); */

  useFrame((_) => {
    if (camera && guy && orbit.current) {
      orbit.current.target.set(
        guy?.position.x ?? 0,
        constants.guy.approximateHeight,
        guy?.position.z ?? 0
      );
    }
  });

  return (
    <group ref={retained}>
      <PerspectiveCamera
        ref={(g) => setSlot("camera", g as Group | null)}
        makeDefault
        position={[
          0,
          constants.guy.approximateHeight * 1.2,
          constants.camera.distance,
        ]}
        fov={45}
        far={500}
      />
      <OrbitControls
        // makeDefault
        ref={orbit}
        onStart={() => useStore.setState({ showCard: false })}
        onEnd={() => useStore.setState({ showCard: true })}
        maxPolarAngle={Math.PI / 2}
        maxDistance={constants.camera.maxDistance}
        enabled={state === "explore"}
        enableDamping={true}
        enablePan={false}
        enableRotate={true}
      />
    </group>
  );
};
