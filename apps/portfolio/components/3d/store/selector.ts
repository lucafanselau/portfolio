import { constants } from "@3d/constants";
import type { ProgressItem } from "@3d/tools/progress";
import { tools } from "@content/tools";
import type { ToolsContent } from "@content/tools/types";
import { shallowEqual } from "fast-equals";
import { Vector3 } from "three";
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
        button: "Let's start!",
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
          disabled: !finished,
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

export const selectors = {
  camera,
  progress,
  content,
  target,
  ui: {
    opaque,
    dismissable,
    open: {
      focus,
      slide,
      target: targetOpen,
    },
  },
};
