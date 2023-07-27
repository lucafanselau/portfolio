import { range } from "@components/utils";
import { coord } from "./coord";
import { Entity, streetId } from "./types";
import { Terrain } from "./types";

const F: Terrain = {
  type: "flat",
  transform: coord.range.create(coord.world.create(0, 0), [1, 1], 0),
};
// const C = TerrainType.Clipping;
const M = F;

const S: Terrain = {
  type: "street",
  transform: coord.range.create(coord.world.create(0, 0), [1, 1], 0),
  variant: "straight",
  id: "street",
};
const T: Terrain = {
  type: "street",
  transform: coord.range.create(coord.world.create(0, 0), [1, 1], 0),
  variant: "turn",
  id: "street",
};

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
    transform: coord.range.building(coord.tile.create(11, 9), "school", 1),
    type: "school",
  },
  {
    id: "house",
    category: "buildings",
    transform: coord.range.building(coord.tile.create(9, 13), "house1", 0),
    type: "house1",
  },
  {
    id: "office",
    category: "buildings",
    transform: coord.range.building(coord.tile.create(8, 5), "office1", 2),
    type: "office1",
  },
];

const initialProps: Entity[] = [
  ...range(0, 4).map(
    (i): Entity => ({
      id: "tree-" + i.toString(),
      category: "props",
      transform: coord.range.create(
        coord.tile.exact(
          coord.world.create(Math.floor(i / 2) * -8 + 4, -12 + (i % 2) * 24)
        ),
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
            transform: coord.range.create(
              coord.tile.create(x, z),
              [1, 1],
              type[1]
            ),
            id: streetId(x, z),
          }
        : ({
            ...type,
            transform: coord.range.create(coord.tile.create(x, z), [1, 1], 0),
            id: type.type === "street" ? streetId(x, z) : undefined,
          } as Terrain)
    )
  ),
  buildings: initialBuildings,
  props: initialProps,
};
