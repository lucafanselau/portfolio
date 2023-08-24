import type { State } from "@3d/store/store";
import { build } from "./build";
import { explore } from "./explore";
import { start } from "./start";
import { ToolsContent } from "./types";

export const tools = {
  start,
  explore,
  build,
} satisfies Record<State, Record<string, ToolsContent>>;

export type Tools = typeof tools;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type ToolContentKeys = KeysOfUnion<Tools[keyof Tools]>;
