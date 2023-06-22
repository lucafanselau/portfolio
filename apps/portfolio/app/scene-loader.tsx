"use client";

import { LoadingAnimation } from "@ui/loader";
import dynamic from "next/dynamic";
import { FC, Suspense } from "react";

const SceneComponent = dynamic(() => import("@3d/scene"), {
	ssr: false,
	loading: () => <LoadingAnimation />,
});

export const SceneLoader: FC = () => {
	return (
		<Suspense fallback={<LoadingAnimation />}>
			<SceneComponent />
		</Suspense>
	);
};
