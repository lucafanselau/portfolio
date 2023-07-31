import { describe, expect, test } from "vitest";

import { constants } from "@3d/constants";
import { coord, Vec2 } from "./coord";

const { tileSize: ts, tiles } = constants.world;
const ps = ts * tiles;

describe("coord", () => {
  test("conversion is consistent", () => {
    const c = coord.tile.create(1, 2);

    // tile -> plane -> world -> plane -> tile
    expect(
      coord.tile.from(coord.plane.from(coord.world.from(coord.plane.from(c))))
    ).toEqual(c);
  });

  test("hardcoded tests", () => {
    expect(coord.plane.from(coord.tile.create(4, 4))).toEqual(
      coord.plane.create(4 * ts, 4 * ts)
    );
    expect(coord.world.from(coord.tile.create(4, 4))).toEqual(
      coord.world.create(-ps / 2 + 4 * ts, -ps / 2 + 4 * ts)
    );
  });

  test("range", () => {
    const cases = [
      [0, [1, 1]],
      [1, [-1, 1]],
      [2, [-1, -1]],
      [3, [1, -1]],
    ] as [number, Vec2][];
    for (const [dir, expected] of cases) {
      const actual = coord.unwrap(
        coord.transform.direction(
          coord.transform.create(coord.tile.create(0, 0), [1, 1], dir)
        )
      );
      expect(actual[0]).to.be.approximately(expected[0], 0.001);
      expect(actual[1]).to.be.approximately(expected[1], 0.001);
    }
  });
});
