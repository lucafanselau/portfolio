"use client";

import {
  Center,
  Environment,
  OrbitControls,
  RoundedBox,
  useTexture,
} from "@react-three/drei";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { IconLoader3 } from "@tabler/icons-react";
import { Suspense } from "react";
import { DoubleSide, Vector3 } from "three";
import { Lights } from "./lights";
import { Person } from "./person";
import { green } from "tailwindcss/colors";
import { useStore } from "./store";

const Plane = () => {
  const texture = useTexture("/crosshair.png");

  const target = useStore(
    (state) => state.target,
    (a, b) => a.equals(b)
  );

  const onClick = ({ point, ...e }: ThreeEvent<MouseEvent>) => {
    useStore.setState({ target: new Vector3().set(point.x, 1e-3, point.z) });
  };
  return (
    <>
      <RoundedBox
        onClick={onClick}
        args={[10, 1, 10]}
        position={[0, -0.5, 0]}
        receiveShadow
      >
        <meshStandardMaterial color={green[300]} side={DoubleSide} />
      </RoundedBox>
      <mesh position={target} rotation={[Math.PI / -2, 0, 0]}>
        <planeBufferGeometry args={[1, 1, 1]} />
        <meshStandardMaterial map={texture} transparent />
      </mesh>
    </>
  );
};

export const Scene = () => {
  return (
    <Suspense fallback={<IconLoader3 className={"animate-spin"} />}>
      <Canvas dpr={[1, 2]} shadows>
        <group dispose={null}>
          <OrbitControls makeDefault />
          {/* <PerspectiveCamera makeDefault position={[5, 0, 30]} /> */}
          <Environment preset={"dawn"} />
          <Lights />
          <Center>
            <Person />
            <Plane />
          </Center>
        </group>
      </Canvas>
    </Suspense>
  );
};
