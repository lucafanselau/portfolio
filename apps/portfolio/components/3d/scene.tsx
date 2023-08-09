"use client";

import { AdaptiveDpr, Environment, Preload, Stats } from "@react-three/drei";
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
import { useStore } from "./store";
import type { State } from "./store/store";
import { ToolsLoader } from "./tools/loader";
import { useTransitions } from "./transition";
import { World } from "./world";

const Loader: FC<{ children: ReactNode }> = ({ children }) => {
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
    <div
      onPointerUp={() => useStore.setState((s) => void (s.pointerDown = false))}
      onPointerDown={() =>
        useStore.setState((s) => void (s.pointerDown = true))
      }
      className="h-full w-full select-none"
    >
      <div className={"absolute left-0 top-0 h-full w-full"}>
        <Canvas
          onCreated={(state) => useStore.setState({ getThree: state.get })}
          dpr={[1, 2]}
          shadows
          gl={{ logarithmicDepthBuffer: true, preserveDrawingBuffer: true }}
          frameloop="demand"
        >
          <Loader>
            {/* 🌄 Environment */}
            <Environment files="./puresky.hdr" background />
            <Lights />
            <Camera />
            {/* 👥 Entities */}
            <AnimatedCharacter />
            <World />
            {/* 📚 Modules */}
            <ExploreModule />
            <BuildModule />
            {/* ✨ Optimizations */}
            <AdaptiveDpr />
            <Preload all />
            {/* ⚙ Debug */}
            {DEBUG && (
              <>
                <axesHelper args={[constants.world.tileSize]} />
                <Stats />
              </>
            )}
          </Loader>
        </Canvas>
      </div>
      {/* NOTE: this is all of the ui */}
      <ToolsLoader />
    </div>
  );
};

export default Scene;
