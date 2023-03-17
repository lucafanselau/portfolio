import { Box2, Box3, Vector3 } from "three";

export const constants = {
  eps: 1e-3,
  guy: {
    approximateHeight: 3.7 * 0.6,
  },
  layout: {
    headerSize: 60,
  },
  camera: {
    distance: 10,
    maxDistance: 70,
  },
  world: {
    tiles: 20,
    tileSize: 8,
    moveScope: {
      min: new Vector3(-17, 0, -25),
      max: new Vector3(17, 0, 26.5),
    },
    interactions: [
      {
        title: "school" as const,
        zone: new Box3(new Vector3(16, 0, -5), new Vector3(20, 0, 5)),
      },
    ],
  },
  threshold: {
    angle: 0.1,
    position: 0.06,
    longIdle: 1.2,
  },
};

type Unwrap<T> = T extends (infer U)[] ? U : T;
export type Interaction = Unwrap<typeof constants.world.interactions>;
