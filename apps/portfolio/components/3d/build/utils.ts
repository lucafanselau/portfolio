import { constants } from "@3d/constants";
import type { Vector3 } from "three";

const { tileSize, tiles } = constants.world;

export type Point = [number, number];
const toTile = (x: number) => {
  return Math.floor(x / tileSize) * tileSize;
};
const toTileIndex = (x: number) => {
  return Math.floor(x / tileSize) + tiles / 2;
};
const toTileCoord = (point: Point): Point => {
  return [toTileIndex(point[0]), toTileIndex(point[1])];
};

const pointEq = (a?: Point, b?: Point) => {
  if (!a || !b) return false;
  return a[0] === b[0] && a[1] === b[1];
};

const toWorldCoord = (point: Point): Point => {
  const x = (point[0] - tiles / 2) * tileSize;
  const z = (point[1] - tiles / 2) * tileSize;
  return [x, z];
};

export const point = {
  world: toWorldCoord,
  eq: pointEq,
  tile: {
    to: toTileCoord,
    normalize: (point: Point): Point => {
      return [toTile(point[0]), toTile(point[1])];
    },
  },
};
