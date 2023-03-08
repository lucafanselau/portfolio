"use client";

import { Center, Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { IconLoader3 } from "@tabler/icons-react";
import { Suspense } from "react";
import { Land } from "./land";
import { Lights } from "./lights";
import { Person } from "./person";

export const Scene = () => {
  return (
    <Suspense fallback={<IconLoader3 className={"animate-spin"} />}>
      <Canvas dpr={[1, 2]} shadows>
        <Center>
          <OrbitControls makeDefault />
          {/* <PerspectiveCamera makeDefault position={[5, 0, 30]} /> */}
          <Environment preset={"dawn"} />
          <Lights />

          <Person />
          <Land />
        </Center>
      </Canvas>
    </Suspense>
  );
};
