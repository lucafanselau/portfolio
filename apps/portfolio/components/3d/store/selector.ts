import { constants } from "@3d/constants";
import type { ProgressItem } from "@3d/tools/progress";
import { ToolContentKeys, tools } from "@content/tools";
import type { ToolsContent } from "@content/tools/types";
import { shallowEqual, deepEqual } from "fast-equals";
import { match } from "ts-pattern";
import { Store } from "./store";

type S = Store;
const pack = <T>(sel: (s: S) => T, eq: (a: T, b: T) => boolean = Object.is) =>
	[sel, eq] as const;

const camera = pack(
	({ state }) => ({
		pan: state === "build",
		zoom: state !== "start",
		rotate: state !== "start",
		distance: constants.camera.maxDistance[state],
	}),
	shallowEqual
);

const progress = pack(
	(store) =>
		match<S, ProgressItem | undefined>(store)
			.with({ state: "start" }, () => ({
				button: "Let's go!",
				target: "explore",
			}))
			.with({ state: "explore" }, ({ world }) => {
				const { history } = world.interaction;
				const total = Object.keys(history).length;
				const checked = Object.values(history)
					.map(Number)
					.reduce((a, b) => a + b, 0);

				const finished = checked >= total;

				let extraText = "";
				if (finished)
					extraText =
						"Great you have finished the quest. Now let's expand the city a bit!";
				else
					extraText = `You are still *missing ${
						total - checked
					} locations*. Look
            for the *School, Office and House*`;
				return {
					button: "Next",
					target: "build",
					disabled: false, // TODO: !finished,
					extraText,
				};
			})

			.otherwise(() => undefined),
	shallowEqual
);

const content = pack(
	// @ts-expect-error unsafe access with "key"
	(s): ToolsContent => tools[s.state]?.[s.ui.key]
);

const opaque = pack(
	(s) => s.state !== "start" && s.ui.mode === "focus" && !s.ui.transition
);
const dismissable = pack((s) => s.state !== "start" && s.ui.mode !== "closed");

const focus = pack((s) => s.ui.mode === "focus" && !s.ui.transition);
const slide = pack((s) => s.ui.mode === "slide" && !s.ui.transition);
const targetOpen = pack((s) => s.state === "explore");
const target = pack(
	(s) => s.target,
	(a, b) => a.equals(b)
);

const actions = pack((s) => {
	if (s.state === "start") return undefined;

	const disabled = (key: ToolContentKeys) => {
		// info is always fine
		if (key === "info") return false;
		// keep all in "build" mode
		if (s.state === "build") return false;
		// for explore, let's check if the user visited it
		// @ts-ignore
		return s.world.interaction.history[key] !== true;
	};

	return (Object.keys(tools[s.state]) as ToolContentKeys[]).map((key) => {
		// @ts-ignore
		return [key, tools[s.state][key]?.icon, disabled(key)] as const;
	});
}, deepEqual);

const state = {
	start: pack((s) => s.state === "start"),
};

export const selectors = {
	camera,
	progress,
	content,
	target,
	state,
	ui: {
		actions,
		opaque,
		dismissable,
		open: {
			focus,
			slide,
			target: targetOpen,
		},
	},
};
