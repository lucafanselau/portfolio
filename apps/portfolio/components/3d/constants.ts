import { Box3, Vector3 } from "three";

export const DEBUG =
  process.env.NEXT_PUBLIC_ENABLE_DEBUG &&
  process.env.NEXT_PUBLIC_NODE_ENV === "development";

export const base = {
  eps: 1e-3,
  guy: {
    approximateHeight: 3.7 * 0.6,
  },
  layout: {
    headerSize: 60,
  },

  world: {
    tiles: 20,
    tileSize: 8,
    tileHeight: 1,

    moveScope: {
      min: new Vector3(-17, 0, -25),
      max: new Vector3(17, 0, 26.5),
    },
    interactions: [
      {
        title: "school" as const,
        zone: new Box3(new Vector3(16, 0, -8), new Vector3(24, 0, 8)),
      },
      {
        title: "office" as const,
        zone: new Box3(new Vector3(-15, 0, -24), new Vector3(-4, 0, -16)),
      },
      {
        title: "home" as const,
        zone: new Box3(new Vector3(-5, 0, 16), new Vector3(5, 0, 24)),
      },
    ],
  },
  threshold: {
    angle: 0.1,
    position: 0.06,
    longIdle: 1.2,
  },
  camera: {
    distance: 8,
    maxDistance: {
      explore: 100,
      start: 100,
      build: 200,
    },
  },
};

export const constants = {
  ...base,
  transitions: {
    position: {
      start: new Vector3(
        -base.camera.distance,
        base.guy.approximateHeight * 2,
        0
      ),
      explore: new Vector3(
        base.camera.distance * -10,
        base.guy.approximateHeight * 10,
        0
      ),
      build: new Vector3(
        base.guy.approximateHeight * -30,
        base.guy.approximateHeight * 60,
        0
      ),
    },
    target: {
      start: new Vector3(0, base.guy.approximateHeight * 1.5, 0),
      explore: new Vector3(0, base.guy.approximateHeight * 1.3, 0),
      build: new Vector3(0, 0, 0),
    },
  },
};

export type Unwrap<T> = T extends (infer U)[] ? U : T;
export type Interaction = Unwrap<typeof constants.world.interactions>;
