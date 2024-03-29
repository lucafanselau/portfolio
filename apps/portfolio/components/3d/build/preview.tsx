import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { Store } from "@3d/store/store";
import { ModelLoader } from "@3d/world/model";
import { Entity } from "@3d/world/types";
import { isNone, isSome } from "@components/utils";
import { deepEqual } from "fast-equals";
import { FC, useEffect, useRef } from "react";
import { Group } from "three";
import { match } from "ts-pattern";
import { mutation } from "./mutation";
import { matchBuild } from "./mutation/build";
import { checkPreviewValid, createPreviewEntity } from "./mutation/preview";
import { BuildStateBuild } from "./types";

// ******************************************************
// LOADER

// Selector to select the current rotation and variant for the build
// TODO: this should be called more sparingly
export const previewEntity = selectors.pack(
  (store: Store): Entity | undefined =>
    matchBuild(store, {
      build: (payload) => createPreviewEntity(store.pointer, payload),
      destroy: () => undefined,
    }),
  deepEqual
);

const BuildBuildPreview: FC<{ state: BuildStateBuild }> = ({
  state: payload,
}) => {
  const entity = useStore(...previewEntity);

  // update valid state when entity changes
  useEffect(() => {
    if (isNone(entity)) return;
    const valid = checkPreviewValid(entity);
    useStore.setState((s) =>
      matchBuild(s, {
        build: (payload) => {
          payload.state.valid = valid;
        },
        destroy: () => {},
      })
    );
  }, [entity]);

  const ref = useRef<Group>(null);
  useEffect(
    () =>
      ref.current && isSome(entity)
        ? mutation.events.init.preview(ref.current, entity.id)
        : void 0,
    [ref.current, entity?.id]
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
