import { constants } from "@3d/constants";
import { isNone } from "@components/utils";
import type { ToolContentKeys } from "@content/tools";
import { tools } from "@content/tools";
import type { ToolsContent } from "@content/tools/types";
import { deepEqual, shallowEqual } from "fast-equals";
import { isMatching } from "ts-pattern";
import type { Store } from "./store";

type S = Store;
const pack = <T>(sel: (s: S) => T, eq: (a: T, b: T) => boolean = Object.is) =>
  [sel, eq] as const;

const camera = pack(
  ({ state, camera: { controlled }, ui: { mode } }) => ({
    pan: state === "build",
    zoom: state !== "start",
    rotate: state !== "start",
    controlsEnabled: !controlled.position,
    distance: constants.camera.maxDistance[state ?? "start"],
  }),
  shallowEqual
);

const content = pack((s): ToolsContent | undefined => {
  if (
    isNone(s.state) ||
    (s.ui.mode.type !== "focus" && s.ui.mode.type !== "slide")
  )
    return undefined;
  // @ts-expect-error unsafe access with "key"
  return tools[s.state][s.ui.mode.key];
});

const hovered = pack((s) => s.world.hovered, shallowEqual);

const opaque = pack(
  (s) =>
    s.state !== "start" &&
    (s.ui.mode.type === "focus" ||
      s.ui.mode.type === "slide" ||
      (s.ui.mode.type === "build" && s.ui.mode.payload.info !== false)) &&
    !s.ui.transition
);
const dismissable = opaque;

const pointer = pack((s) => s.pointer, deepEqual);

const state = {
  explore: pack((s) => s.state === "explore"),
  build: pack((s) => s.state === "build"),
  start: pack((s) => s.state === "start"),
};

const focus = pack(
  (s) =>
    (s.ui.mode.type === "focus" ||
      (s.ui.mode.type === "build" && s.ui.mode.payload.info === "focus")) &&
    !s.ui.transition
);
const slide = pack(
  (s) =>
    (s.ui.mode.type === "slide" ||
      (s.ui.mode.type === "build" && s.ui.mode.payload.info === "slide")) &&
    !s.ui.transition
);
const targetOpen = pack((s) => s.state === "explore");
const buildOpen = pack((s) => s.ui.mode.type === "build");
const outline = pack(
  isMatching({ ui: { mode: { type: "build", payload: { type: "destroy" } } } })
);
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
    // @ts-expect-error (unsafe access with "key")
    return s.world.interaction.history[key] !== true;
  };

  if (isNone(s.state)) return [];
  return (Object.keys(tools[s.state]) as ToolContentKeys[]).map((key) => {
    // @ts-expect-error (unsafe access with "key")
    const content = tools[s.state ?? "start"][key] as ToolsContent;
    return [key, content.icon, disabled(key)] as const;
  });
}, deepEqual);

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
      outline,
      target: targetOpen,
      build: buildOpen,
    },
  },
};
