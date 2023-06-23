"use client";

import { useHasMounted } from "@components/hooks/has-mounted";
import { cn } from "@ui/utils";
import { constants } from "@3d/constants";
import { offset, size, useFloating, autoUpdate } from "@floating-ui/react-dom";
import { AppearCard } from "@ui/card";
import { ScrollArea } from "@ui/scroll-area";
import { FC, ReactNode, useEffect, useLayoutEffect } from "react";

export const SpeechBubble: FC<
	{ open: boolean } & Record<
		"header" | "content" | "action",
		ReactNode | undefined
	>
> = ({ header, content, action, open }) => {
	// this is mf crazy, easy resizing on small deviced
	const { x, y, refs, update } = useFloating({
		placement: "top",
		open: open,
		whileElementsMounted:
			process.env.NEXT_PUBLIC_NODE_ENV === "development"
				? autoUpdate
				: undefined,

		middleware: [
			offset(10),
			size({
				boundary: document.documentElement,
				padding: 16,
				apply({ availableWidth, availableHeight, elements }) {
					Object.assign(elements.floating.style, {
						maxWidth: `${availableWidth}px`,
						maxHeight: `calc(${
							availableHeight - constants.layout.headerSize
						}px - 1rem)`,
					});
				},
			}),
		],
	});
	const isMounted = useHasMounted();
	useEffect(update, [open, isMounted, header, content, action]);

	return (
		<div className={"relative"}>
			<div className={"absolute inset-0"} ref={refs.setReference} />
			<AppearCard
				open={open}
				ref={refs.setFloating}
				className={cn(
					"p-4 w-[56ch] flex flex-col space-y-2 md:space-y-4 h-fit",
					!open && "pointer-events-none"
				)}
				style={{
					top: y ?? 0,
					left: x ?? 0,
				}}
			>
				<div>{header}</div>
				<div
					className={
						"basis-[min-content] flex-grow-0 flex-shrink min-h-0 flex items-stretch"
					}
				>
					<ScrollArea>
						<div className="flex flex-col space-y-2">
							{content}
							{action !== null && (
								<div
									className={"flex items-center flex-row space-x-2 justify-end"}
								>
									{action}
								</div>
							)}
						</div>
					</ScrollArea>
				</div>
			</AppearCard>
		</div>
	);
};
