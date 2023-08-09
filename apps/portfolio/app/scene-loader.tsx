"use client";

import { LoadingAnimation } from "@ui/loader";
import dynamic from "next/dynamic";
import type { FC } from "react";
import { Suspense } from "react";

const SceneComponent = dynamic(() => import("@3d/scene"), {
  ssr: false,
  loading: () => <LoadingAnimation />,
});

export const SceneLoader: FC = () => {
  return <SceneComponent />;
};
