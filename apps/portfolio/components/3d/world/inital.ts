import { range } from "@components/utils";
import { coord } from "./coord";
import { Entity, Terrain, terrainId } from "./types";

const F: Terrain = {
  type: "flat",
  id: "tile",
  appear: "build",
};
const E = { ...F, appear: "explore" };
// const C = TerrainType.Clipping;
const M = { ...F, appear: "start" };

const S: Terrain = {
  type: "street",
  variant: "straight",
  id: "street",
  rotation: 0,
  appear: "explore",
};
const T: Terrain = {
  type: "street",
  variant: "turn",
  id: "street",
  rotation: 0,
  appear: "explore",
};

const template = [
  [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, E, E, E, E, E, E, E, E, F, F, F, F, F, F],
  [F, F, F, F, F, F, E, E, E, E, E, E, E, E, F, F, F, F, F, F],
  [
    F,
    F,
    F,
    F,
    F,
    F,
    E,
    E,
    [T, 3],
    [S, 1],
    [S, 1],
    [T, 0],
    E,
    E,
    F,
    F,
    F,
    F,
    F,
    F,
  ],
  [F, F, F, F, F, F, E, E, S, M, M, S, E, E, F, F, F, F, F, F],
  [F, F, F, F, F, F, E, E, S, M, M, S, E, E, F, F, F, F, F, F],
  [
    F,
    F,
    F,
    F,
    F,
    F,
    E,
    E,
    [T, 2],
    [S, 1],
    [S, 1],
    [T, 1],
    E,
    E,
    F,
    F,
    F,
    F,
    F,
    F,
  ],
  [F, F, F, F, F, F, E, E, E, E, E, E, E, E, F, F, F, F, F, F],
  [F, F, F, F, F, F, E, E, E, E, E, E, E, E, F, F, F, F, F, F],
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
    transform: coord.transform.building(coord.tile.create(13, 10), "school", 1),
    type: "school",
    hidden: true,
    appear: "explore",
  },
  {
    id: "house",
    category: "buildings",
    transform: coord.transform.building(coord.tile.create(10, 13), "house1", 0),
    type: "house1",
    hidden: true,
    appear: "explore",
  },
  {
    id: "office",
    category: "buildings",
    transform: coord.transform.building(
      coord.tile.create(9.5, 7),
      "office1",
      2
    ),
    type: "office1",
    hidden: true,
    appear: "explore",
  },
  {
    category: "buildings",
    id: "starting park",
    transform: {
      anchor: { type: "tile", value: [10, 10] },
      extend: { type: "tile", value: [2, 2] },
      rotation: 0,
    },
    hidden: true,
    appear: "start",
    type: "park4",
  },
];

const initialProps: Entity[] = [
  ...range(0, 4).map(
    (i): Entity => ({
      id: "tree-" + i.toString(),
      category: "props",
      transform: coord.transform.create(
        coord.world.create(Math.floor(i / 2) * -8 + 4, -12 + (i % 2) * 24),
        [0.2, 0.2]
      ),
      type: "tree",
      hidden: true,
      appear: "build",
      variant: ["one", "two", "three", "four"][i],
    })
  ),
];

export const initial = {
  terrain: template.map((row, x) =>
    row.map<Terrain>((type, z) =>
      Array.isArray(type)
        ? {
            ...type[0],
            id: terrainId(x, z),
            rotation: type[1],
          }
        : ({
            ...type,
            id: terrainId(x, z),
            rotation: type.type === "street" ? 0 : undefined,
          } as Terrain)
    )
  ),
  buildings: initialBuildings,
  props: initialProps,
};
