import { range } from "@components/utils";
import { coord } from "./coord";
import { Entity, terrainId, Terrain } from "./types";

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
  [F, F, F, F, F, E, E, E, E, E, E, E, E, E, E, F, F, F, F, F],
  [F, F, F, F, F, E, E, E, E, E, E, E, E, E, E, F, F, F, F, F],
  [
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
  ],
  [F, F, F, F, F, E, E, S, M, M, M, M, S, E, E, F, F, F, F, F],
  [F, F, F, F, F, E, E, S, M, M, M, M, S, E, E, F, F, F, F, F],
  [
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
  ],
  [F, F, F, F, F, E, E, E, E, E, E, E, E, E, E, F, F, F, F, F],
  [F, F, F, F, F, E, E, E, E, E, E, E, E, E, E, F, F, F, F, F],
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
  },
  {
    id: "house",
    category: "buildings",
    transform: coord.transform.building(coord.tile.create(10, 14), "house1", 0),
    type: "house1",
    hidden: true,
  },
  {
    id: "office",
    category: "buildings",
    transform: coord.transform.building(
      coord.tile.create(9.5, 6),
      "office1",
      2
    ),
    type: "office1",
    hidden: true,
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
