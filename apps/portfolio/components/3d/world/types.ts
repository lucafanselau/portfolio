import type { models } from "@3d/generated/loader";
import { Vector3 } from "three";

export type BuildingType = keyof (typeof models)["buildings"];
export type PropType = keyof (typeof models)["props"];

export const enum TerrainType {
  Flat = 0,
  Clipping = 1,
  StreetEnd = 2,
  StreetStraight = 3,
  StreetTurn = 4,
  StreetThree = 5,
  StreetFour = 6,
}

export type Building = {
  id: string;
  type: BuildingType;
  rotation: number;
  position: Vector3;
};

export type Prop = {
  id: string;
  type: PropType;
  rotation: number;
  position: Vector3;
};
