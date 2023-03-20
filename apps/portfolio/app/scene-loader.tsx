"use client";

import dynamic from "next/dynamic";
import { FC, Suspense } from "react";

const SceneComponent = dynamic(() => import("@3d/scene"), {
  ssr: true,
  loading: () => <div>Loading...</div>,
});

export const SceneLoader: FC = () => {
  return (
    <Suspense fallback={<p>Loading</p>}>
      <SceneComponent />
    </Suspense>
  );
};
