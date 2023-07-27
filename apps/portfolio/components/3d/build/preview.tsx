import { constants } from "@3d/constants";
import { AssetKey } from "@3d/generated-loader";
import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { Store } from "@3d/store/store";
import { coord, vec2 } from "@3d/world/coord";
import { ModelLoader } from "@3d/world/model";
import { Entity } from "@3d/world/types";
import { deepEqual } from "fast-equals";
import { FC, useEffect, useRef } from "react";
import { Group } from "three";
import { match } from "ts-pattern";
import { mutation } from "./mutation";
import { BuildStateBuild } from "./types";
import { isNone, isSome } from "@components/utils";

// ******************************************************
// LOADER

// Selector to select the current rotation and variant for the build
// TODO: this should be called more sparingly
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
          transform: coord.range.building(
            pointer,
            id as AssetKey<"buildings">,
            rotation
          ),
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
  const ref = useRef<Group>(null);
  useEffect(
    () =>
      ref.current &&
      isSome(entity) &&
      mutation.events.init.preview(ref.current, entity),
    [ref.current, entity]
  );
  if (isNone(entity)) return null;

  return <ModelLoader ref={ref} entity={entity} />;
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
