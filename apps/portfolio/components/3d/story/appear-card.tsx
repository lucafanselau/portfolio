import { Card } from "@ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@ui/collapsible";
import { FC, ReactNode, useCallback, useRef, useState } from "react";
import useMeasure from "react-use-measure";
import { useSpring, animated, useSpringRef } from "@react-spring/web";
import { easing } from "maath";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { P } from "@ui/typography";
import { isSome } from "@components/utils";

const labels = {
	closed: "Click to see more",
	opened: "Close",
};

export const AppearCardRoot: FC<{ header: ReactNode; children: ReactNode }> = ({
	header,
	children,
}) => {
	// [contentOpen, setOpen] = useState(false);

	const textRef = useRef<HTMLParagraphElement>(null);
	const [measureRef, { height }] = useMeasure();

	const api = useSpringRef();
	const springs = useSpring({
		ref: api,
		from: { height: 0, rotate: 0 },
	});

	const onOpenChange = useCallback(
		async (value: boolean) => {
			if (value) {
				if (isSome(textRef.current))
					textRef.current.textContent = labels.opened;
				await Promise.all(
					api.start({
						height,
						rotate: 180,
					})
				);
			} else {
				if (isSome(textRef.current))
					textRef.current.textContent = labels.closed;
				await Promise.all(api.start({ height: 0, rotate: 0 }));
			}
		},
		[height]
	);

	return (
		<div className={"relative"}>
			<Collapsible asChild onOpenChange={onOpenChange}>
				<animated.div
					className={
						"container p-0 card absolute left-0 -translate-x-1/2 w-[calc(100vw-16px)] max-w-[500px] max-h-[60vh] overflow-hidden"
					}
					style={{
						bottom: springs.height.to((v) => -(v * 0.5)),
					}}
				>
					<CollapsibleTrigger asChild>
						<div className={"flex flex-col p-4 "}>
							{header}
							<div className={"flex justify-start items-center space-x-2"}>
								<animated.div style={{ rotate: springs.rotate }}>
									<IconChevronDown size={20} className={"text-muted"} />
								</animated.div>
								<P size={"xs"} ref={textRef} className="text-muted">
									{labels.closed}
								</P>
							</div>
							<CollapsibleContent forceMount asChild>
								<animated.div
									className={"overflow-hidden"}
									style={{ overflow: "hidden", height: springs.height }}
								>
									<div ref={measureRef}>{children}</div>
								</animated.div>
							</CollapsibleContent>
						</div>
					</CollapsibleTrigger>
				</animated.div>
			</Collapsible>
		</div>
	);
};

export const AppearCardAction = ({ children }: { children: ReactNode }) => {
	return <div className={""}>{children}</div>;
};
