import { AssetCategory, AssetEntry, AssetKey } from "@3d/generated-loader";
import { useStore } from "@3d/store";
import { ThreeEvent } from "@react-three/fiber";
import { Object3D } from "three";
import { isMatching } from "ts-pattern";
import { buildPattern, matchBuild } from "./build";

const destroyPattern = buildPattern("destroy");

// simple function to check if this is the first call to this function
// with this id using the localStorage web api
const isFirst = (id: string) => {
  if (typeof window === "undefined") return true;

  const key = `first-${id}`;
  const first = localStorage.getItem(key) === null;

  if (first) {
    localStorage.setItem(key, "true");
    return true;
  } else {
    return false;
  }
};

export const events = {
  model: (entity: string) => ({
    onPointerDown: (e: ThreeEvent<PointerEvent>) => {
      const { getState: get, setState: set } = useStore;
      // NOTE: THIS IS A MOBILE ONLY INTERACTION
      // if (getCanHover()) return;
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

      const info = isFirst("tutorial-build") ? "focus" : false;

      get().initBuild({
        type: "build",
        info,
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
      const info = isFirst("tutorial-destroy") ? "focus" : false;
      get().initBuild({ type: "destroy", info });
    },
  },
  other: {
    rotate: (dir: "CW" | "CCW") => {
      const { getState: get, setState: set } = useStore;

      set((s) => {
        matchBuild(s, {
          build: ({ state }) => {
            state.rotation =
              ((state.rotation ?? 0) + (dir === "CW" ? -1 : 1)) % 4;
          },
          destroy: () => {},
        });
      });
    },
  },
};
