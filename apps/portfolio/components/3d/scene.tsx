"use client";

import { Environment, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { LoadingAnimation } from "@ui/loader";
import { FC, PropsWithChildren, ReactNode, Suspense } from "react";
import { Camera } from "./camera";
import { constants } from "./constants";
import { Lights } from "./lights";
import { AnimatedCharacter } from "./character";
import { useStore } from "./store";
import { Target } from "./world/target";
import { useTransitions } from "./transition";
import { World } from "./world";
import { Tools } from "./tools";
import { State } from "./store/store";
import { GeneratedLoader } from "./generated-loader";

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
		<Suspense fallback={<LoadingAnimation />}>
			<div className={"absolute left-0 top-0 w-full h-full"}>
				<Canvas dpr={[1, 2]} shadows gl={{ logarithmicDepthBuffer: true }}>
					<Loader>
						{process.env.ENABLE_DEBUG &&
							process.env.NEXT_PUBLIC_NODE_ENV === "development" && (
								<axesHelper args={[constants.world.tileSize]} />
							)}
						{process.env.NEXT_PUBLIC_NODE_ENV === "development" && <Stats />}
						<Environment background files="./puresky.hdr" />
						<Lights />
						<AnimatedCharacter></AnimatedCharacter>
						<Camera />
						<Target />
						<World />
					</Loader>
				</Canvas>
			</div>
			{/* NOTE: this is all of the ui */}
			<Tools />
		</Suspense>
	);
};

export default Scene;
