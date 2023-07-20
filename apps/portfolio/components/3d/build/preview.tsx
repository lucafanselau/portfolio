import { constants } from "@3d/constants";
import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { Store } from "@3d/store/store";
import { coord, vec2 } from "@3d/world/coord";
import { ModelLoader } from "@3d/world/model";
import { Entity } from "@3d/world/types";
import { isNone } from "@components/utils";
import { deepEqual } from "fast-equals";
import { FC } from "react";
import { match } from "ts-pattern";
import { mutation } from "./mutation";
import { BuildStateBuild } from "./types";

// ******************************************************
// LOADER

// Selector to select the current rotation and variant for the build
export const previewEntity = selectors.pack(
	(store: Store): Entity | undefined => {
		if (store.ui.mode.type !== "build") return undefined;
		const state = store.ui.mode.payload;
		if (state.type !== "build") return undefined;
		const payload = state.payload;
		const pointer = coord.tile.from(store.pointer);

		return match<BuildStateBuild["payload"], Entity>(payload)
			.with({ type: "streets" }, () => {
				// streets are auto rotating and auto variant
				const [variant, rotation] = mutation.streets.type(
					...coord.unwrap(pointer)
				);
				return {
					category: "streets",
					id: "preview",
					transform: coord.range.create(pointer, vec2.splat(1), rotation),
					type: "street",
					variant,
				};
			})
			.with({ type: "buildings" }, ({ id, state: { rotation } }) => {
				return {
					category: "buildings",
					id: "preview",
					transform: coord.range.building(pointer, id, rotation),
					type: id,
				};
			})
			.with({ type: "props" }, ({ id, state: { rotation, variant } }) => {
				const position = coord.tile.exact(store.pointer);
				// Remove so that we have to lower left corner
				position.value = vec2.sub(position.value, vec2.splat(0.1));
				const transform = coord.range.create(
					position,
					vec2.splat(0.2),
					rotation
				);
				return {
					category: "props",
					id: "preview",
					transform,
					type: id,
					variant,
				};
			})
			.exhaustive();
	},
	deepEqual
);

const BuildBuildPreview: FC<{ state: BuildStateBuild }> = ({
	state: payload,
}) => {
	const entity = useStore(...previewEntity);
	if (isNone(entity)) return null;
	return <ModelLoader entity={entity} />;
};

export const BuildPreview = () => {
	const build = useStore(...selectors.ui.build);

	return (
		match(build)
			.with({ type: "build" }, (state) => <BuildBuildPreview state={state} />)
			// destroy is handled by the outline effect
			.otherwise(() => null)
	);
};
