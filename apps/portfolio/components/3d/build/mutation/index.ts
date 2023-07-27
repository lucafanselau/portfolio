import { streets } from "./streets";
import { events } from "./events";

// const pointer = {
//   streets: (p) => {
//     const point = coord.tile.from(p);
//     const [type, rotation] = streets.type(...coord.unwrap(point));
//     return [coord.range.create(point, [1, 1], rotation), type];
//   },
// } satisfies Record<AssetCategory, (pointer: Coord) => [TileRange, string]>;

export const mutation = {
  streets,
  events,
};
