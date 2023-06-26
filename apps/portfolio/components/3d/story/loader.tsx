import { constants } from "@3d/constants";
import { useStore } from "@3d/store";
import { useHasTransition } from "@3d/transition";
import { Html } from "@react-three/drei";
import { useMemo } from "react";
import { match } from "ts-pattern";
import { AppearCardRoot } from "./appear-card";
import {
	ExploreBubbleContent,
	ExploreHome,
	ExploreOffice,
	ExploreSchool,
} from "./explore";
import { SpeechBubble } from "./speech-bubble";
import { StartBubbleContent } from "./start";

const { approximateHeight } = constants.guy;

export const BubbleLoader = () => {
	const state = useStore((s) => s.state);
	const interaction = useStore((s) => s.world.interaction);
	const open = useStore(
		(s) =>
			s.showCard &&
			(s.character.state === "idle" || s.character.state === "greet")
	);

	const hasTransition = useHasTransition();
	const content = useMemo(
		() =>
			match(state)
				.with("start", () => StartBubbleContent)
				.with("explore", () =>
					match(interaction)
						.with("school", () => ExploreSchool)
						.with("home", () => ExploreHome)
						.with("office", () => ExploreOffice)
						.with(undefined, () => ExploreBubbleContent)
						.exhaustive()
				)
				.with("top-level", () => StartBubbleContent)
				.exhaustive(),
		[state, interaction]
	);

	return (
		<Html position={[0, approximateHeight * 1.05, 0]}>
			{/*<AppearCardRoot header={content.header}>
				{content.content}
				{content.action}
				</AppearCardRoot>*/}
			<SpeechBubble open={open && !hasTransition} {...content} />
		</Html>
	);
};
