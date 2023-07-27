import { AssetCategory, AssetEntry, AssetKey } from "@3d/generated-loader";
import { useStore, Store } from "@3d/store";
import { coord } from "@3d/world/coord";
import { Entity } from "@3d/world/types";
import { getCanHover } from "@components/hooks/use-can-hover";
import { GroupProps, ThreeEvent } from "@react-three/fiber";
import { Object3D } from "three";
import { isMatching, Pattern } from "ts-pattern";
import { build, buildOrDestroy, buildPattern } from "./build";

const destroyPattern = buildPattern("destroy");
const { getState: get, setState: set } = useStore;

const onPointer = (e: ThreeEvent<PointerEvent>) => {
  if (!e.point) return;
  get().setPointer(coord.world.create(e.point.x, e.point.z));
};
const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
  onPointer(e);
  set((s) => void (s.pointerDown = true));

  // If we cannot hover lets not build, this is handled by a button then
  if (!getCanHover()) return;
  // otherwise lets build
  buildOrDestroy();
};
const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
  set((s) => void (s.pointerDown = false));
  onPointer(e);
};

export const events = {
  interaction: {
    onPointerDown,
    onPointerUp,
    onPointerMove: onPointer,
  },
  model: (entity: Entity) => ({
    onPointerOver: (e) => {
      // If we cannot hover lets not build, this is handled by a button then
      if (!getCanHover()) return;
      if (!isMatching(destroyPattern, get())) return;
      // otherwise lets append that
      set((s) => {
        s.world.hovered.push([e.object, entity]);
      });
    },
    onPointerOut: (e) => {
      // If we cannot hover lets not build, this is handled by a button then
      if (!getCanHover()) return;
      if (!isMatching(destroyPattern, get())) return;
      // otherwise lets append that
      set((s) => {
        s.world.hovered = s.world.hovered.filter(([h, _]) => h !== e.object);
      });
    },
    onPointerDown: (e) => {
      console.log("pointer down", getCanHover());
      // NOTE: THIS IS A MOBILE ONLY INTERACTION
      if (getCanHover()) return;
      if (!isMatching(destroyPattern, get())) return;
      // otherwise lets append that
      set((s) => {
        const search = s.world.hovered.findIndex(([h, _]) => h === e.object);
        if (search === -1) {
          s.world.hovered.push([e.object, entity]);
        } else {
          s.world.hovered.splice(search, 1);
        }
      });
    },
  }),
  init: {
    preview: (object: Object3D, entity: Entity) => {
      set((s) => void s.world.hovered.push([object, entity]));
      return () =>
        set(
          (s) =>
            void (s.world.hovered = s.world.hovered.filter(
              ([h, _]) => h !== object
            ))
        );
    },
    build: (type: AssetCategory, entry: AssetEntry) => {
      // default variant
      // lets select a random variant
      const variant = Array.isArray(entry.file)
        ? entry.file[Math.floor(Math.random() * entry.file.length)].id
        : undefined;

      get().initBuild({
        type: "build",
        payload: {
          id: entry.id as AssetKey<AssetCategory>,
          type,
          state: {
            rotation: 0,
            valid: true,
            variant,
          },
        },
      });
    },
    destroy: () => {
      get().initBuild({ type: "destroy" });
    },
  },
} satisfies Record<
  "interaction" | "model",
  GroupProps | ((entity: Entity) => GroupProps)
> & { init: object };
