import { range } from "@components/utils";
import { Vector3 } from "three";
import { coord } from "./coord";
import type { Building, Prop } from "./types";
import { TerrainType } from "./types";

const F = TerrainType.Flat;
// const C = TerrainType.Clipping;
const M = F;
const S = TerrainType.StreetStraight;
const T = TerrainType.StreetTurn;

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
] as ([TerrainType, number] | TerrainType)[][];

const initialBuildings: Building[] = [
  {
    id: "school",
    range: coord.range.building(coord.world.create(16, 16), "school", 1),
    type: "school",
  },
  {
    id: "house",
    range: coord.range.building(coord.world.create(-8, 24), "house1", 0),
    type: "house1",
  },
  {
    id: "office",
    range: coord.range.building(coord.world.create(8, -24), "office1", 2),
    type: "office1",
  },
];

const initialProps: Prop[] = [
  ...range(0, 4).map(
    (i): Prop => ({
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
    row.map<[TerrainType, number]>((type) =>
      Array.isArray(type) ? type : [type, 0]
    )
  ),
  buildings: initialBuildings,
  props: initialProps,
};
