import { constants } from "@3d/constants";
import type { ProgressItem } from "@3d/tools/progress";
import { ToolContentKeys, tools } from "@content/tools";
import type { ToolsContent } from "@content/tools/types";
import { deepEqual, shallowEqual } from "fast-equals";
import { match } from "ts-pattern";
import { Store } from "./store";
import collection from "@3d/generated/collection.json";

type S = Store;
const pack = <T>(sel: (s: S) => T, eq: (a: T, b: T) => boolean = Object.is) =>
  [sel, eq] as const;

const camera = pack(
  ({ state, camera: { controlled }, ui: { mode } }) => ({
    pan: state === "build",
    zoom: state !== "start",
    rotate: state !== "start",
    controlsEnabled: !controlled.position && mode.type !== "build",
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

const content = pack((s): ToolsContent | undefined => {
  if (s.ui.mode.type !== "focus" && s.ui.mode.type !== "slide")
    return undefined;
  // @ts-expect-error unsafe access with "key"
  return tools[s.state]?.[s.ui.mode.key];
});

const hovered = pack((s) => s.world.hovered, shallowEqual);

const opaque = pack(
  (s) => s.state !== "start" && s.ui.mode.type === "focus" && !s.ui.transition
);
const dismissable = pack(
  (s) =>
    s.state !== "start" &&
    s.ui.mode.type !== "closed" &&
    s.ui.mode.type !== "build"
);

const entry = pack((s) => {
  if (s.ui.mode.type !== "build") return undefined;
  const { mode } = s.ui.mode;
  if (mode.type !== "build") return undefined;
  const { key } = mode;
  // streets are all the same
  // prbly we should have a variant mode though
  if (key.type === "streets") return collection.streets[0];
  return collection[key.type].find((e) => e.id === key.id);
}, Object.is);
const pointer = pack((s) => s.pointer, deepEqual);

const focus = pack((s) => s.ui.mode.type === "focus" && !s.ui.transition);
const slide = pack((s) => s.ui.mode.type === "slide" && !s.ui.transition);
const targetOpen = pack((s) => s.state === "explore");
const buildOpen = pack((s) => s.ui.mode.type === "build");

const target = pack(
  (s) => s.target,
  (a, b) => a.equals(b)
);
const build = pack(
  (s) => (s.ui.mode.type === "build" ? s.ui.mode.mode : undefined),
  deepEqual
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
  pointer,
  progress,
  hovered,
  content,
  entry,
  target,
  state,
  ui: {
    actions,
    opaque,
    dismissable,
    build,
    open: {
      focus,
      slide,
      target: targetOpen,
      build: buildOpen,
    },
  },
};
