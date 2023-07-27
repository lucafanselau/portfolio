import { Store, useStore } from "@3d/store";
import { coord, vec2 } from "@3d/world/coord";
import { isNone } from "@components/utils";
import { match, Pattern } from "ts-pattern";
import { previewEntity } from "../preview";
import { streets } from "./streets";

const { getState: get, setState: set } = useStore;

export const build = () => {
  // TODO: Check if build is valid

  // reuse the preview entity routine
  const entity = previewEntity[0](get());
  if (isNone(entity)) return;
  if (entity.category === "streets") {
    // TODO: dumb we could be reusing the variant from the entity
    streets.build(entity.transform.anchor);
  } else {
    // just push back the entity
    set((s) => void s.world.entities.push(entity));
  }
};

export const destroy = () => {
  // For now we will destroy everything that is currently hovered
  const {
    world: { hovered },
  } = get();

  if (hovered.length === 0) return;
  set((s) => {
    s.world.entities = s.world.entities.filter(
      (e) => !hovered.some(([_, entity]) => entity.id === e.id)
    );
  });
};

export const buildPattern = (
  type: "destroy" | "build"
): Pattern.Pattern<Store> => ({
  state: "build",
  ui: { mode: { type: "build", payload: { type } } },
});

export const buildOrDestroy = () => {
  match(get())
    .with(buildPattern("build"), build)
    .with(buildPattern("destroy"), destroy)
    .run();
};
