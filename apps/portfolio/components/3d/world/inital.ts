import { range } from "@components/utils";
import { Vector3 } from "three";
import { Building, BuildingType, TerrainType } from "./types";

const F = TerrainType.Flat;
const C = TerrainType.Clipping;
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
    position: new Vector3(16, 0, 16),
    type: "school",
    rotation: 1,
  },
  {
    id: "house",
    position: new Vector3(-8, 0, 24),
    type: "house1",
    rotation: 0,
  },
  {
    id: "office",
    position: new Vector3(8, 0, -24),
    type: "office1",
    rotation: 2,
  },
  // ...range(0, 4).map((i) => ({
  //   id: "tree-" + i,
  //   position: new Vector3(Math.floor(i / 2) * -8, 0, -16 + (i % 2) * 24),
  //   type: BuildingType.Tree1 + i,
  //   rotation: 0,
  // })),
];

export const initial = {
  terrain: template.map((row) =>
    row.map<[TerrainType, number]>((type) =>
      Array.isArray(type) ? type : [type, 0]
    )
  ),
  buildings: initialBuildings,
};
