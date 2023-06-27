import { State, useStore } from "@3d/store";
import { isNone, isSome } from "@components/utils";
import { useIsomorphicLayoutEffect } from "@react-spring/web";
import {
  KeyboardControls,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useEffect, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import { OrbitControls as OrbitControlsType } from "three-stdlib";
import { constants } from "./constants";
import {
  defaultTransitionConfig,
  createTransition,
  useHasTransition,
} from "./transition";
import { useRetainedTransform } from "./utils";
import { useToolsStore } from "./world/tools/store";

export const cameraTargets: Record<State, Vector3> = {
  start: new Vector3(
    -constants.camera.distance,
    constants.guy.approximateHeight * 1.3,
    0
  ),
  explore: new Vector3(
    -constants.camera.distance * 2,
    constants.guy.approximateHeight * 4,
    0
  ),
  "top-level": new Vector3(0, constants.guy.approximateHeight * 20, 0),
};

export const transitionToCamera = async (
  state: State,
  lookAt: "guy" | "origin"
) => {
  const {
    slots: { camera, guy },
  } = useStore.getState();

  const target = cameraTargets[state];
  // first transition camera to new target
  await createTransition((delta) => {
    if (!camera || !guy) return false;
    const { smoothTime, maxSpeed, eps } = defaultTransitionConfig;

    const result = easing.damp3(
      camera.position,
      target,
      smoothTime,
      delta,
      maxSpeed,
      undefined,
      eps
    );

    if (lookAt === "guy") {
      camera.lookAt(
        guy.position.x,
        constants.guy.approximateHeight * 1.3,
        guy.position.z
      );
    } else {
      camera.lookAt(0, 0, 0);
    }

    return result;
  });
};

const cameraFocus = new Vector3(0, constants.guy.approximateHeight * 1.3, 0);

export const Camera = () => {
  const setSlot = useStore((state) => state.setSlot);
  const retained = useRef<Group>(null);
  const guy = useStore((state) => state.slots.guy);
  const state = useStore((s) => s.state);
  const camera = useStore((s) => s.slots.camera);
  const hasInteraction = useHasTransition();
  // const hasTools = useToolsStore((s) => s.state !== undefined);

  useEffect(() => {
    const guy = useStore.getState().slots.guy;
    camera?.lookAt(
      guy?.position.x ?? 0,
      constants.guy.approximateHeight * 1.3,
      guy?.position.z ?? 0
    );
  }, [camera]);

  const orbit = useRef<OrbitControlsType | null>(null);

  /* const [target] = useState(new Vector3()); */

  useFrame((_) => {
    if (camera && guy && orbit.current && !hasInteraction) {
      if (state === "explore") {
        orbit.current.target.set(
          guy?.position.x ?? 0,
          constants.guy.approximateHeight * 1.3,
          guy?.position.z ?? 0
        );
      }
    }
  });

  // useIsomorphicLayoutEffect(() => {
  //   if (isNone(orbit.current)) return;
  //   if (hasInteraction) {
  //     orbit.current?.reset();
  //     orbit.current.enabled = false;
  //   } else {
  //     orbit.current.enabled = true;
  //   }
  // }, [hasInteraction]);

  return (
    <group ref={retained}>
      <PerspectiveCamera
        ref={(g) => setSlot("camera", g as Group | null)}
        makeDefault
        position={cameraTargets["start"]}
        fov={45}
        far={500}
      />
      <OrbitControls
        makeDefault
        ref={(o) => {
          orbit.current = o;
          o?.update();
        }}
        onStart={() => useStore.setState({ showCard: false })}
        onEnd={(e) => {
          useStore.setState({ showCard: true });
        }}
        maxPolarAngle={Math.PI / 2 - constants.eps}
        // maxDistance={constants.camera.maxDistance[state]}
        target={cameraFocus}
        enabled={state !== "start"}
        enableDamping={true}
        enablePan={state === "top-level"}
        enableRotate={true}
      />
    </group>
  );
};
