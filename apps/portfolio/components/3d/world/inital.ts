import { range } from "@components/utils";
import { Vector3 } from "three";
import { coord } from "./coord";
import type { Entity } from "./types";
import { Terrain } from "./types";

const F = { type: "flat" } as Terrain;
// const C = TerrainType.Clipping;
const M = F;

const S: Terrain = {
  type: "street",
  range: coord.range.create(coord.world.create(0, 0), [1, 1], 0),
  variant: "straight",
};
const T = (type: number): Terrain => ({
  type: "street",
  range: coord.range.create(coord.world.create(0, 0), [1, 1], 0),
  variant: "turn",
});

const template = [
  [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
  [
    F,
    F,
    F,
    F,
    F,
    F,
    F,
    [T, 3],
    [S, 1],
    [S, 1],
    [S, 1],
    [S, 1],
    [T, 0],
    F,
    F,
    F,
    F,
    F,
    F,
    F,
  ],
  [F, F, F, F, F, F, F, S, M, M, M, M, S, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, S, M, M, M, M, S, F, F, F, F, F, F, F],
  [
    F,
    F,
    F,
    F,
    F,
    F,
    F,
    [T, 2],
    [S, 1],
    [S, 1],
    [S, 1],
    [S, 1],
    [T, 1],
    F,
    F,
    F,
    F,
    F,
    F,
    F,
  ],
  [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
] as ([Terrain, number] | Terrain)[][];

const initialBuildings: Entity[] = [
  {
    id: "school",
    category: "buildings",
    transform: coord.range.building(coord.world.create(16, 16), "school", 1),
    type: "school",
  },
  {
    id: "house",
    category: "buildings",
    transform: coord.range.building(coord.world.create(-8, 24), "house1", 0),
    type: "house1",
  },
  {
    id: "office",
    category: "buildings",
    transform: coord.range.building(coord.world.create(8, -24), "office1", 2),
    type: "office1",
  },
];

const initialProps: Entity[] = [
  ...range(0, 4).map(
    (i): Entity => ({
      id: "tree-" + i.toString(),
      position: coord.plane.create(
        Math.floor(i / 2) * -8 + 4,
        -12 + (i % 2) * 24
      ),
      // @ts-expect-error tree1, tree2, tree3, tree4 are all valid
      type: "tree" + Math.ceil(Math.random() * 4).toString(),
      rotation: 0,
    })
  ),
];

export const initial = {
  terrain: template.map((row) =>
    row.map<Terrain>((type) =>
      Array.isArray(type) && type[0].type === "street"
        ? { ...type[0], range: { ...type[0].range, rotation: type[1] } }
        : (type as Terrain)
    )
  ),
  buildings: initialBuildings,
  props: initialProps,
};
