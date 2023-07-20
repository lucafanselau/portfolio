import { constants } from "@3d/constants";
import { AssetKey, findAssetEntry } from "@3d/generated-loader";
import { Plane } from "@react-three/drei";
import { ComponentProps } from "react";
import { Box2, Vector2 } from "three";
import { match } from "ts-pattern";

export type Vec2 = [number, number];
// general mathemtical utility functions for 2 dimensional vector Point
export const vec2 = {
  add: (a: Vec2, b: Vec2): Vec2 => [a[0] + b[0], a[1] + b[1]],
  sub: (a: Vec2, b: Vec2): Vec2 => [a[0] - b[0], a[1] - b[1]],
  mul: (a: Vec2, b: Vec2): Vec2 => [a[0] * b[0], a[1] * b[1]],
  div: (a: Vec2, b: Vec2): Vec2 => [a[0] / b[0], a[1] / b[1]],

  splat: (a: number): Vec2 => [a, a],
  floor: (a: Vec2): Vec2 => [Math.floor(a[0]), Math.floor(a[1])],
  create: (x: number, z: number): Vec2 => [x, z],
};

export type PlaneCoord = {
  type: "plane";
  value: Vec2;
};

export type WorldCoord = {
  type: "world";
  value: Vec2;
};

export type TileCoord = {
  type: "tile";
  value: Vec2;
};

export type Coord = PlaneCoord | WorldCoord | TileCoord;

// ************
// Utility functions

const { tileSize: ts, tiles } = constants.world;
const ps = ts * tiles;

const tile = {
  create(x: number, y: number): TileCoord {
    return { type: "tile", value: [x, y] };
  },
  new(value: Vec2): TileCoord {
    return { type: "tile", value };
  },

  // convert any coord to a tile coord
  from(from: Coord): TileCoord {
    return match<Coord, TileCoord>(from)
      .with({ type: "plane" }, ({ value }) => ({
        type: "tile",
        value: vec2.floor(vec2.div(value, vec2.splat(ts))),
      }))
      .with({ type: "world" }, (world) => tile.from(plane.from(world)))
      .with({ type: "tile" }, ({ value }) => ({ type: "tile", value }))
      .exhaustive();
  },
  exact(from: Coord): TileCoord {
    return match<Coord, TileCoord>(from)
      .with({ type: "plane" }, ({ value }) => ({
        type: "tile",
        value: vec2.div(value, vec2.splat(ts)),
      }))
      .with({ type: "world" }, (world) => tile.from(plane.from(world)))
      .with({ type: "tile" }, ({ value }) => ({ type: "tile", value }))
      .exhaustive();
  },
};

const plane = {
  create(x: number, y: number): PlaneCoord {
    return { type: "plane", value: [x, y] };
  },
  new(value: Vec2): PlaneCoord {
    return { type: "plane", value };
  },

  // convert any coord to a plane coord
  from(from: Coord): PlaneCoord {
    return match<Coord, PlaneCoord>(from)
      .with({ type: "plane" }, ({ value }) => ({ type: "plane", value }))
      .with({ type: "world" }, ({ value }) => ({
        type: "plane",
        value: vec2.add(value, vec2.splat(0.5 * ps)),
      }))
      .with({ type: "tile" }, ({ value }) => ({
        type: "plane",
        value: vec2.mul(value, vec2.splat(ts)),
      }))
      .exhaustive();
  },
};

const world = {
  create(x: number, y: number): WorldCoord {
    return { type: "world", value: [x, y] };
  },
  new(value: Vec2): WorldCoord {
    return { type: "world", value };
  },
  // convert any coord to a world coord
  from(from: Coord): WorldCoord {
    return match<Coord, WorldCoord>(from)
      .with({ type: "plane" }, ({ value }) => ({
        type: "world",
        value: vec2.sub(value, vec2.splat(0.5 * ps)),
      }))
      .with({ type: "world" }, ({ value }) => ({ type: "world", value }))
      .with({ type: "tile" }, (tile) => world.from(plane.from(tile)))
      .exhaustive();
  },
};

// ************
// Tile Range type

type Extend = Vec2;
export type Transform = {
  anchor: TileCoord;
  extend: TileCoord;
  // Number can be 0..3
  rotation: number;
};

const __vec = new Vector2(0, 0);
const __rot_base = new Vector2(0, 0);

const __vec_0 = new Vector2(0, 0);
const __vec_1 = new Vector2(0, 0);

// NOTE: intended for internal use
function rangeDirection(range: Transform): Vec2 {
  __vec.set(range.extend.value[0], range.extend.value[1]);
  // __rot_base.set(range.anchor.value[0], range.anchor.value[1]);
  __vec.rotateAround(__rot_base, (range.rotation * Math.PI) / 2);
  return vec2.create(__vec.x, __vec.y);
}

const unwrap = (coord: Coord) => coord.value;

const range = {
  create(anchor: Coord, extend: Extend = [1, 1], rotation = 0): Transform {
    return {
      anchor: tile.from(anchor),
      extend: tile.new(extend),
      rotation,
    };
  },

  building(
    anchor: Coord,
    type: AssetKey<"buildings">,
    rotation = 0
  ): Transform {
    const entry = findAssetEntry("buildings", type);
    return {
      anchor: tile.from(anchor),
      extend: tile.new(entry.extend as Vec2),
      rotation,
    };
  },
  // Get the lower left corner of the range
  lower(range: Transform): TileCoord {
    return range.anchor;
  },
  upper(range: Transform): TileCoord {
    const dir: Vec2 = rangeDirection(range);
    return tile.new(vec2.add(range.anchor.value, dir));
  },
  middle(range: Transform): TileCoord {
    const dir: Vec2 = rangeDirection(range);
    return tile.new(
      vec2.add(range.anchor.value, vec2.mul(vec2.splat(0.5), dir))
    );
  },
  box(range: Transform, box: Box2) {
    const lower = unwrap(this.lower(range));
    const upper = unwrap(this.upper(range));

    const points = [
      __vec_0.set(lower[0], lower[1]),
      __vec_1.set(upper[0], upper[1]),
    ];
    box.setFromPoints(points);
  },
};

// methods intended for custom use cases
const objects = (range: Transform) => {
  const [x, z] = unwrap(world.from(range.anchor));
  const [w, d] = unwrap(plane.from(range.extend));
  return {
    plane: {
      args: [w, d, 2, 2],
      rotation: [-Math.PI / 2, 0, 0],
      position: [0, constants.eps, 0],
    },
    wrapper: {
      position: [x, 0, z],
    },
    rotation: {
      position: [w / 2, 0, d / 2],
      rotation: [0, (range.rotation * Math.PI) / 2, 0],
    },
    model: {
      //position: [w / 2, 0, d / 2],
    },
  } satisfies Record<string, ComponentProps<typeof Plane>>;
};

export const coord = {
  tile,
  plane,
  world,
  range,
  objects,
  unwrap,
};
