import { constants } from "@3d/constants";
import { AssetKey, findAssetEntry } from "@3d/generated-loader";
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
  eq: (a: Vec2, b: Vec2): boolean => a[0] === b[0] && a[1] === b[1],
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

  floor(coord: Coord) {
    const value = tile.from(coord).value;
    return tile.new(vec2.floor(value));
  },

  // convert any coord to a tile coord
  // (from: Coord): TileCoord {
  //   return match<Coord, TileCoord>(from)
  //     .with({ type: "plane" }, ({ value }) => ({
  //       type: "tile",
  //       value: vec2.floor(vec2.div(value, vec2.splat(ts))),
  //     }))
  //     .with({ type: "world" }, (world) => tile.from(plane.from(world)))
  //     .with({ type: "tile" }, ({ value }) => ({ type: "tile", value }))
  //     .exhaustive();
  // },
  from(from: Coord): TileCoord {
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
function rangeDirection(range: { extend: TileCoord; rotation: number }): Vec2 {
  __vec.set(range.extend.value[0], range.extend.value[1]);
  // __rot_base.set(range.anchor.value[0], range.anchor.value[1]);
  __vec.rotateAround(__rot_base, (range.rotation * Math.PI) / 2);
  return vec2.create(__vec.x, __vec.y);
}

const unwrap = (coord: Coord) => coord.value;

const transform = {
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
  direction: (transform: Omit<Transform, "anchor">): TileCoord => {
    return tile.new(rangeDirection(transform));
  },
  // Get the lower left corner of the range
  // lower(range: Transform): TileCoord {
  //   if (range.anchorType === "corner") {
  //     return range.anchor;
  //   } else {
  //     const dir: Vec2 = rangeDirection(range);
  //     return tile.new(
  //       vec2.sub(range.anchor.value, vec2.mul(dir, vec2.splat(0.5)))
  //     );
  //   }
  // },
  // upper(range: Transform): TileCoord {
  //   const dir: Vec2 = rangeDirection(range);
  //   if (range.anchorType === "corner") {
  //     return tile.new(vec2.add(range.anchor.value, dir));
  //   } else {
  //     return tile.new(
  //       vec2.add(range.anchor.value, vec2.mul(dir, vec2.splat(0.5)))
  //     );
  //   }
  // },
  // middle(range: Transform): TileCoord {
  //   const dir: Vec2 = rangeDirection(range);
  //   return tile.new(
  //     vec2.add(range.anchor.value, vec2.mul(vec2.splat(0.5), dir))
  //   );
  // },
  box(t: Transform, box: Box2) {
    const { anchor } = t;

    const direction = coord.unwrap(transform.direction(t));
    const lower = vec2.sub(anchor.value, vec2.mul(direction, vec2.splat(0.5)));
    const upper = vec2.add(anchor.value, vec2.mul(direction, vec2.splat(0.5)));
    // center
    __vec_0.set(...lower);
    // size (must be plane here, since world does a coordinate system translation)
    __vec_1.set(...upper);
    box.setFromPoints([__vec_0, __vec_1]);

    box.max.subScalar(5 * constants.eps);
    box.min.addScalar(5 * constants.eps);
  },
};

// ************************************
// Bundled export

export const coord = {
  eq: (a: Coord, b: Coord) => {
    return a.type === b.type && vec2.eq(a.value, b.value);
  },
  map: <C extends Coord>(coord: C, fn: (v: Vec2) => Vec2): C => {
    return { type: coord.type, value: fn(coord.value) } as C;
  },
  tile,
  plane,
  world,
  transform: transform,
  unwrap,
};
