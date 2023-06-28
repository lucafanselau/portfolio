"use client";

import { Environment, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { IconLoader3 } from "@tabler/icons-react";
import { LoadingAnimation } from "@ui/loader";
import { FC, PropsWithChildren, ReactNode, Suspense } from "react";
import { Camera } from "./camera";
import { constants } from "./constants";
import { Instances } from "./generated";
import { Lights } from "./lights";
import { AnimatedCharacter } from "./character";
import { State, useStore } from "./store";
import { BubbleLoader } from "./story/loader";
import { Target } from "./target";
import { useTransitions } from "./transition";
import { World } from "./world";
// import { BuildingTools } from "./world/tools";
import { ToolsOverlay } from "./world/tools/overlay";
import { Tools } from "./tools";

const Loader: FC<{ children: ReactNode }> = ({ children }) => {
  useTransitions();
  return <Instances>{children}</Instances>;
};

const ConditionalLoader: FC<PropsWithChildren<{ states: State[] }>> = ({
  states,
  children,
}) => {
  const isMatching = useStore((s) => states.includes(s.state));
  if (isMatching) return <>{children}</>;
  else return null;
};

const Scene = () => {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <Canvas dpr={[1, 2]} shadows gl={{ logarithmicDepthBuffer: true }}>
        <Loader>
          {process.env.ENABLE_DEBUG &&
            process.env.NEXT_PUBLIC_NODE_ENV === "development" && (
              <axesHelper args={[constants.world.tileSize]} />
            )}
          {process.env.NEXT_PUBLIC_NODE_ENV === "development" && <Stats />}
          <Environment background files="./puresky.hdr" />
          <Lights />
          <AnimatedCharacter>
            {/*<ConditionalLoader states={["start"]}>
              <BubbleLoader />
							</ConditionalLoader>*/}
          </AnimatedCharacter>
          <Camera />
          <ConditionalLoader states={["explore", "start"]}>
            <Target />
          </ConditionalLoader>
          <World />
          <ConditionalLoader states={["build"]}>
            <ToolsOverlay />
          </ConditionalLoader>
        </Loader>
      </Canvas>
      {/* NOTE: this is all of the ui */}
      <Tools />
    </Suspense>
  );
};

export default Scene;
