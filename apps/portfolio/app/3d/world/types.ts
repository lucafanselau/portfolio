import { Vector3 } from "three";

export const enum TerrainType {
  Flat = 0,
  Clipping = 1,
  StreetEnd = 2,
  StreetStraight = 3,
  StreetTurn = 4,
  StreetThree = 5,
  StreetFour = 6,
}

export const enum BuildingType {
  School = 0,
  House = 1,
  Office = 2,
  Tree1 = 3,
  Tree2 = 4,
  Tree3 = 5,
  Tree4 = 6,
}

// building sizes are measured in tiles (1 tile = 8m), normal houses are 2x2 tiles
// first number is the width (along the street), second number is the depth (perpendicular to the street)
export const getBuildingSize = (type: BuildingType): [number, number] => {
  switch (type) {
    case BuildingType.School:
      return [4, 2];
    case BuildingType.House:
      return [2, 2];
    case BuildingType.Office:
      return [3, 2];
    case BuildingType.Tree1:
    case BuildingType.Tree2:
    case BuildingType.Tree3:
    case BuildingType.Tree4:
      return [1, 1];
  }
};

export type Building = {
  id: string;
  type: BuildingType;
  rotation: number;
  position: Vector3;
};
