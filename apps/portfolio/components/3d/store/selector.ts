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

const content = pack((s): ToolsContent | undefined => {
  if (s.ui.mode.type !== "focus" && s.ui.mode.type !== "slide")
    return undefined;
  // @ts-expect-error unsafe access with "key"
  return tools[s.state]?.[s.ui.mode.key];
});

const hovered = pack((s) => s.world.hovered, shallowEqual);

const opaque = pack(
  (s) =>
    s.state !== "start" &&
    (s.ui.mode.type === "focus" || s.ui.mode.type === "slide") &&
    !s.ui.transition
);
const dismissable = pack(
  (s) =>
    s.state !== "start" &&
    s.ui.mode.type !== "closed" &&
    s.ui.mode.type !== "build"
);

const pointer = pack((s) => s.pointer, deepEqual);

const focus = pack((s) => s.ui.mode.type === "focus" && !s.ui.transition);
const slide = pack((s) => s.ui.mode.type === "slide" && !s.ui.transition);
const targetOpen = pack((s) => s.state === "explore");
const buildOpen = pack((s) => s.ui.mode.type === "build");
const build = pack((s) =>
  s.ui.mode.type === "build" ? s.ui.mode.payload : undefined
);

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
  pack,
  camera,
  pointer,
  hovered,
  content,
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
