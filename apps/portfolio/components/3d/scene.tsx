"use client";

import {
  AdaptiveDpr,
  Environment,
  Preload,
  Stats,
  Loader as DreiLoader,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { LoadingAnimation } from "@ui/loader";
import type { FC, PropsWithChildren, ReactNode } from "react";
import { Suspense } from "react";
import { BuildModule } from "./build";
import { Camera } from "./camera";
import { AnimatedCharacter } from "./character";
import { constants, DEBUG } from "./constants";
import { ExploreModule } from "./explore";
import { GeneratedLoader } from "./generated-loader";
import { Lights } from "./lights";
import { Loader } from "./loading-progress";
import { useStore } from "./store";
import type { State } from "./store/store";
import { ToolsLoader } from "./tools/loader";
import { useTransitions } from "./transition";
import { World } from "./world";

const UtilityLoader: FC<{ children: ReactNode }> = ({ children }) => {
  useTransitions();
  return <GeneratedLoader>{children}</GeneratedLoader>;
};

export const ConditionalLoader: FC<PropsWithChildren<{ states: State[] }>> = ({
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
      <div
        onPointerUp={() =>
          useStore.setState((s) => void (s.pointerDown = false))
        }
        onPointerDown={() =>
          useStore.setState((s) => void (s.pointerDown = true))
        }
        className="h-full w-full select-none"
      >
        <div className={"absolute left-0 top-0 h-full w-full"}>
          <Suspense fallback={<LoadingAnimation />}>
            <Canvas
              onCreated={(state) => useStore.setState({ getThree: state.get })}
              dpr={[1, 2]}
							flat
              shadows
              gl={{ logarithmicDepthBuffer: true, preserveDrawingBuffer: true }}
              frameloop="demand"
            >
              <UtilityLoader>
                {/* ✨ Optimizations */}
                <AdaptiveDpr />
                <Preload all />
                {/* 🌄 Environment */}
                <Environment files="./puresky.hdr" />
                <Lights />
                <Camera />
                {/* 📚 Modules */}
                <ExploreModule />
                <BuildModule />
                {/* 👥 Entities */}
                <AnimatedCharacter />
                <World />
                {/* ⚙ Debug */}
                {DEBUG && (
                  <>
                    <axesHelper args={[constants.world.tileSize]} />
                    <Stats />
                  </>
                )}
              </UtilityLoader>
            </Canvas>
          </Suspense>
        </div>
        {/* NOTE: this is all of the ui */}
        <ToolsLoader />
      </div>
    </Suspense>
  );
};

export default Scene;
