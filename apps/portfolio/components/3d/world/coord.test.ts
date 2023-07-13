import { expect } from "vitest";
import { test } from "vitest";
import { describe } from "vitest";

import { constants } from "@3d/constants";
import { coord } from "./coord";

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
    const range = coord.range.create(coord.world.create(1, 2));

    expect(coord.range.middle(range)).toEqual(coord.tile.create(10.5, 10.5));
  });
});
