import { useStore } from "@3d/store";
import { coord, TileCoord } from "@3d/world/coord";
import { streetId, StreetVariant, Terrain } from "@3d/world/types";
import { match } from "ts-pattern";

const isStreet = (terrain: Terrain | undefined) => {
  if (terrain === undefined) return false;
  return terrain.type === "street";
};

const getTileType = (x: number, z: number) => {
  const { world } = useStore.getState();

  const left = world.terrain[x - 1]?.[z];
  const right = world.terrain[x + 1]?.[z];
  const top = world.terrain[x]?.[z - 1];
  const bottom = world.terrain[x]?.[z + 1];

  const neighbors = [top, left, bottom, right];
  const streetLookup = neighbors.map(isStreet);
  const numConnections = streetLookup.filter(Boolean).length;

  return match<number, [StreetVariant, number]>(numConnections)
    .with(0, () => ["four", 0])
    .with(1, () => {
      const rotation = streetLookup.indexOf(true);
      return ["end", rotation];
    })
    .with(2, () => {
      const streets = streetLookup
        .map((isStreet, i) => ({ isStreet, i }))
        .filter(({ isStreet }) => isStreet);

      const diff = streets[1].i - streets[0].i;

      if (diff === 1 || diff === 3) {
        // only one difference -> turn
        return ["turn", diff === 3 ? streets[0].i : streets[1].i];
      } else {
        // two differences -> straight
        return ["straight", streets[0].i - 1];
      }
    })
    .with(3, () => ["three", streetLookup.indexOf(false)])
    .with(4, () => ["four", 0])
    .run();
};

const updateNeighbor = (x: number, z: number) => {
  const { world, setTileType } = useStore.getState();
  const type = world.terrain[x]?.[z];
  if (!type) return;

  if (isStreet(type)) {
    const [newType, rotation] = getTileType(x, z);
    const terrain: Terrain = {
      type: "street",
      transform: coord.range.create(coord.tile.create(x, z), [1, 1], rotation),
      variant: newType,
      id: streetId(x, z),
    };

    setTileType(x, z, terrain);
  }
};

const destroyStreet = (tile: TileCoord) => {
  const [x, z] = coord.unwrap(tile);
  const { setTileType } = useStore.getState();
  const terrain: Terrain = {
    type: "flat",
    transform: coord.range.create(coord.tile.create(x, z), [1, 1], 0),
  };
  setTileType(x, z, terrain);
  // also update the neighbors
  updateNeighbor(x - 1, z);
  updateNeighbor(x + 1, z);
  updateNeighbor(x, z - 1);
  updateNeighbor(x, z + 1);
};

const buildStreet = (tile: TileCoord) => {
  const { setTileType } = useStore.getState();
  const [x, z] = coord.unwrap(tile);

  const [type, rotation] = getTileType(x, z);
  const terrain: Terrain = {
    type: "street",
    transform: coord.range.create(coord.tile.create(x, z), [1, 1], rotation),
    variant: type,
    id: streetId(x, z),
  };

  setTileType(x, z, terrain);
  // also update the neighbors
  updateNeighbor(x - 1, z);
  updateNeighbor(x + 1, z);
  updateNeighbor(x, z - 1);
  updateNeighbor(x, z + 1);
};

export const streets = {
  build: buildStreet,
  destroy: destroyStreet,
  type: getTileType,
};
