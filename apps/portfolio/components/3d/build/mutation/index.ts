import { coord } from "@3d/world/coord";
import { streets } from "./streets";

const pointer = {
  streets: (p) => {
    const point = coord.tile.from(p);

    return coord.range.create(point, [1, 1]);
  },
} satisfies Record<AssetCategory, (pointer: Coord) => TileRange>;

export const mutation = {
  streets,
  pointer,
};
