"use client";

import { Canvas } from "@react-three/fiber";
import { Center, Environment, OrbitControls } from "@react-three/drei";
import { ActionName, Model as Guy } from "./guy";
import { useControls } from "leva";

const lights = [
  [2, 1, 4, 1],
  [8, 0, 4, 1],
];

export const Scene = () => {
  const { action, fade } = useControls({
    action: {
      value: "Idle" as ActionName,
      options: ["Idle", "Walk", "Run"] as const,
    },
    fade: 1,
  });

  return (
    <Canvas dpr={[1, 2]}>
      {lights.map(([x, y, z, intensity], i) => (
        <pointLight
          key={i}
          intensity={intensity}
          position={[x, y, z]}
          color="#fff"
        />
      ))}
      <group dispose={null}>
        <OrbitControls />
        <Environment preset={"city"} />
        <Center>
          <Guy scale={3} fade={fade} action={action} />
        </Center>
      </group>
    </Canvas>
  );
};
