"use client";

import { AdaptiveDpr, Environment, Preload, Stats } from "@react-three/drei";
import { Canvas, invalidate, useThree } from "@react-three/fiber";
import { LoadingAnimation } from "@ui/loader";
import { FC, PropsWithChildren, ReactNode, useEffect } from "react";
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

const UtilityLoader: FC<{ children: ReactNode }> = ({ children }) => {
  useTransitions();

  // NOTE: This fixes a bug where after regress finished, no higher resolution image would be rendered
  // since we are using frameloop="demand" we need to manually trigger a rerender
  const perf = useThree((s) => s.viewport.dpr);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    invalidate(100);
  }, [perf]);

  return <GeneratedLoader>{children}</GeneratedLoader>;
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
              performance={{ debounce: 250, min: 0.75 }}
              // dpr={[1, 2]}
              // flat
              shadows
              gl={{ logarithmicDepthBuffer: true, preserveDrawingBuffer: true }}
              frameloop="demand"
            >
              <UtilityLoader>
                {/* ✨ Optimizations */}
                <AdaptiveDpr />
                <Preload all />
                {/* 🌄 Environment */}
                <Environment background files="./puresky.hdr" />
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
