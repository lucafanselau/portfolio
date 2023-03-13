"use client";

import { Environment, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { IconLoader3 } from "@tabler/icons-react";
import { Suspense } from "react";
import { Camera } from "./camera";
import { Lights } from "./lights";
import { Person } from "./person";
import { BubbleLoader } from "./story/loader";
import { Target } from "./target";
import { World } from "./world";

export const Scene = () => {
  return (
    <Suspense
      fallback={
        <div className={"w-full h-full flex justify-center items-center"}>
          <IconLoader3 className={"animate-spin"} size={48} />
        </div>
      }
    >
      <Canvas dpr={[1, 2]} shadows gl={{ logarithmicDepthBuffer: true }}>
        {process.env.NEXT_PUBLIC_NODE_ENV === "development" && <Stats />}
        <Environment preset={"city"} />
        {/* <OrbitControls makeDefault /> */}
        <Lights />
        <Person>
          <BubbleLoader />
        </Person>
        <Camera />
        <Target />
        {/* <OrbitControls makeDefault /> */}
        {/* <Land /> */}
        <World />
      </Canvas>
    </Suspense>
  );
};
