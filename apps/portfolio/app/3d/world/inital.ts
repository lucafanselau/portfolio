import { TerrainType } from "./types";

const F = TerrainType.Flat;
const C = TerrainType.Clipping;
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
  [F, F, F, F, F, F, F, S, C, C, C, C, S, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, S, C, C, C, C, S, F, F, F, F, F, F, F],
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
export const initalTerrain = template.map((row) =>
  row.map<[TerrainType, number]>((type) =>
    Array.isArray(type) ? type : [type, 0]
  )
);
