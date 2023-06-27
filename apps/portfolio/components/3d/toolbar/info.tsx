import { ExploreBubbleContent, ExploreHome } from "@3d/story/explore";
import { animated, useSpring, useSpringRef, config } from "@react-spring/web";
import { IconInfoCircle } from "@tabler/icons-react";
import { Button } from "@ui/button";
import {
	CollapsibleTrigger,
	Collapsible,
	CollapsibleContent,
} from "@ui/collapsible";
import { cn } from "@ui/utils";
import { FC, ReactNode, useCallback, useState } from "react";
import { match } from "ts-pattern";

export type SlideState = "closed" | "primary" | "open";

export const InfoBox: FC<{
	children: ReactNode;
	state: SlideState;
	onChange: (value: SlideState) => void;
}> = ({ children, onChange, state }) => {
	const api = useSpringRef();
	const spring = useSpring({
		// ref: api,
		from: { y: "0%" },
		to: {
			y: match(state)
				.with("closed", () => "100%")
				.with("primary", () => "-50%")
				.with("open", () => "0%")
				.run(),
		},
		config: {
			mass: 2,
			...config.slow,
		},
	});

	console.log(state);

	// const onOpenChange = useCallback((value: boolean) => {
	// 	if (value) {
	// 		api.start({ y: "100%" });
	// 	} else {
	// 		api.start({ y: "0%" });
	// 	}
	// }, []);

	return (
		<Collapsible
			open={state !== "closed"}
			onOpenChange={(v) => onChange(v ? "primary" : "closed")}
		>
			<CollapsibleTrigger asChild>
				<Button variant="ghost" size="icon">
					<IconInfoCircle />
				</Button>
			</CollapsibleTrigger>
			<div
				className="absolute top-[var(--radius)] pb-[var(--radius)] pt-64 -translate-y-full w-full left-0 right-0 overflow-hidden z-30"
				// py-[var(--radius)]
			>
				<CollapsibleContent forceMount asChild>
					<animated.div
						// className="mb-[var(--radius)]"
						className="relative"
						style={{
							transform: spring.y.to((v) => `translateY(${v})`),
						}}
					>
						<div className="card rounded-t-lg rounded-b-none border-b-0">
							{children}
						</div>
						{/*NOTE: This div is only here to provide a background for the open animation*/}
						<div
							className={cn(
								"bg-background h-8 absolute -bottom-8 left-0 right-0 border-x-2 border-t-2",
								state === "primary" && "hidden"
							)}
						/>
					</animated.div>
				</CollapsibleContent>
			</div>
		</Collapsible>
	);
};

export const InfoBoxLoader: FC<{ children: ReactNode }> = ({ children }) => {
	const [state, setState] = useState<SlideState>("primary");

	return (
		<InfoBox state={state} onChange={setState}>
			{children}
		</InfoBox>
	);
};
