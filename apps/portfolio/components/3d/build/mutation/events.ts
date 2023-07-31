import { AssetCategory, AssetEntry, AssetKey } from "@3d/generated-loader";
import { useStore } from "@3d/store";
import { coord } from "@3d/world/coord";
import { getCanHover } from "@components/hooks/use-can-hover";
import { GroupProps, ThreeEvent } from "@react-three/fiber";
import { Object3D } from "three";
import { isMatching } from "ts-pattern";
import { buildOrDestroy, buildPattern, matchBuild } from "./build";

const destroyPattern = buildPattern("destroy");

const onPointer = (e: ThreeEvent<PointerEvent>) => {
  const { getState: get, setState: set } = useStore;
  if (!e.point) return;
  get().setPointer(coord.world.create(e.point.x, e.point.z));
};
const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
  const { getState: get, setState: set } = useStore;
  onPointer(e);
  set((s) => void (s.pointerDown = true));

  // If we cannot hover lets not build, this is handled by a button then
  // if (!getCanHover()) return;
  // // otherwise lets build
  // buildOrDestroy();
};
const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
  const { getState: get, setState: set } = useStore;
  set((s) => void (s.pointerDown = false));
  onPointer(e);
};
const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
  const { getState: get, setState: set } = useStore;
  if (!get().pointerDown) return;
  onPointer(e);
};

export const events = {
  interaction: {
    onPointerDown,
    onPointerUp,
    onPointerMove: onPointerMove,
  },
  model: (entity: string) => ({
    onPointerOver: (e) => {
      const { getState: get, setState: set } = useStore;
      // If we cannot hover lets not build, this is handled by a button then
      if (!getCanHover()) return;
      if (!isMatching(destroyPattern, get())) return;

      // otherwise lets append that
      set((s) => {
        if (s.world.hovered.find(([_, id]) => id === entity)) return;
        s.world.hovered.push([e.object, entity]);
      });
    },
    onPointerOut: (e) => {
      const { getState: get, setState: set } = useStore;
      // If we cannot hover lets not build, this is handled by a button then
      if (!getCanHover()) return;
      if (!isMatching(destroyPattern, get())) return;
      // otherwise lets append that
      set((s) => {
        s.world.hovered = s.world.hovered.filter(([_, id]) => id !== entity);
      });
    },
    onPointerDown: (e) => {
      const { getState: get, setState: set } = useStore;
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
    preview: (object: Object3D, entity: string) => {
      const { getState: get, setState: set } = useStore;
      set((s) => void s.world.hovered.push([object, entity]));
      return () =>
        set(
          (s) =>
            void (s.world.hovered = s.world.hovered.filter(
              ([_, id]) => id !== entity
            ))
        );
    },
    build: (type: AssetCategory, entry: AssetEntry) => {
      const { getState: get, setState: set } = useStore;
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
      const { getState: get, setState: set } = useStore;
      get().initBuild({ type: "destroy" });
    },
  },
  other: {
    rotate: (dir: "CW" | "CCW") => {
      const { getState: get, setState: set } = useStore;

      set((s) => {
        matchBuild(s, {
          build: ({ state }) => {
            state.rotation =
              ((state.rotation ?? 0) + (dir === "CW" ? 1 : -1)) % 4;
          },
          destroy: () => {},
        });
      });
    },
  },
} satisfies Record<
  "interaction" | "model",
  GroupProps | ((entity: string) => GroupProps)
> & { init: object; other: object };
