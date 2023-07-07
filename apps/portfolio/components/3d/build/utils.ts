import { constants } from "@3d/constants";
import { Vector3 } from "three";

const { tileSize, tiles } = constants.world;

type Point = [number, number];
const toTile = (x: number) => {
  return Math.floor(x / tileSize) + tiles / 2;
};
const toTileCoord = (vec: Vector3): Point => {
  return [toTile(vec.x), toTile(vec.z)];
};

const pointEq = (a: Point, b: Point) => {
  return a[0] === b[0] && a[1] === b[1];
};

export const point = {
  tile: toTileCoord,
  eq: pointEq,
};
