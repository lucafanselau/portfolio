import { useStore } from "@3d/store";
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
import {
  Group,
  Vector3,
  PerspectiveCamera as PerspectiveCameraType,
} from "three";
import { OrbitControls as OrbitControlsType } from "three-stdlib";
import { constants } from "./constants";
import { selectors } from "./store/selector";
import { defaultTransitionConfig, createTransition } from "./transition";

export const Camera = () => {
  const { zoom, pan, rotate, distance } = useStore(...selectors.camera);
  const controls = useRef<OrbitControlsType | null>(null);
  const camera = useRef<PerspectiveCameraType>(null);

  useFrame(() => {
    if (isNone(camera.current) || isNone(controls.current)) return;
    const { target, position, locked } = useStore.getState().camera;
    if (locked) {
      camera.current.position.copy(position);
      controls.current.target.copy(target);
    } else {
      // now write the camera movement back into the store
      position.copy(camera.current.position);
      target.copy(controls.current.target);
    }
  });

  return (
    <group>
      <PerspectiveCamera ref={camera} makeDefault fov={45} far={500} />
      <OrbitControls
        makeDefault
        ref={controls}
        maxPolarAngle={Math.PI / 2 - constants.eps}
        maxDistance={distance}
        enabled={true}
        enablePan={pan}
        enableZoom={zoom}
        enableRotate={rotate}
        enableDamping={true}
      />
    </group>
  );
};
