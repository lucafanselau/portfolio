import { useStore } from "@3d/store";
import { match } from "ts-pattern";
import { TerrainType } from "./types";

const isStreet = (terrain: TerrainType | undefined) => {
  if (terrain === undefined) return false;
  return terrain >= TerrainType.StreetEnd && terrain <= TerrainType.StreetFour;
};

const getTileType = (x: number, z: number) => {
  const { world } = useStore.getState();

  const left = world.terrain[x - 1]?.[z]?.[0];
  const right = world.terrain[x + 1]?.[z]?.[0];
  const top = world.terrain[x]?.[z - 1]?.[0];
  const bottom = world.terrain[x]?.[z + 1]?.[0];

  const neighbors = [top, left, bottom, right];
  const streetLookup = neighbors.map(isStreet);
  const numConnections = streetLookup.filter(Boolean).length;

  return match<number, [TerrainType, number]>(numConnections)
    .with(0, () => [TerrainType.StreetFour, 0])
    .with(1, () => {
      const rotation = streetLookup.indexOf(true);
      return [TerrainType.StreetEnd, rotation];
    })
    .with(2, () => {
      const streets = streetLookup
        .map((isStreet, i) => ({ isStreet, i }))
        .filter(({ isStreet }) => isStreet);

      const diff = streets[1].i - streets[0].i;

      if (diff === 1 || diff === 3) {
        // only one difference -> turn
        return [
          TerrainType.StreetTurn,
          diff === 3 ? streets[0].i : streets[1].i,
        ];
      } else {
        // two differences -> straight
        return [TerrainType.StreetStraight, streets[0].i - 1];
      }
    })
    .with(3, () => [TerrainType.StreetThree, streetLookup.indexOf(false)])
    .with(4, () => [TerrainType.StreetFour, 0])
    .run();
};

const updateNeighbor = (x: number, z: number) => {
  const { world, setTileType } = useStore.getState();
  const type = world.terrain[x]?.[z]?.[0];
  if (!type) return;

  if (isStreet(type)) {
    const [newType, rotation] = getTileType(x, z);
    setTileType(x, z, newType, rotation);
  }
};

const destroyStreet = (x: number, z: number) => {
  const { setTileType } = useStore.getState();
  setTileType(x, z, TerrainType.Flat);
  // also update the neighbors
  updateNeighbor(x - 1, z);
  updateNeighbor(x + 1, z);
  updateNeighbor(x, z - 1);
  updateNeighbor(x, z + 1);
};

const buildStreet = (x: number, z: number) => {
  const { setTileType } = useStore.getState();

  const [type, rotation] = getTileType(x, z);
  setTileType(x, z, type, rotation);
  // also update the neighbors
  updateNeighbor(x - 1, z);
  updateNeighbor(x + 1, z);
  updateNeighbor(x, z - 1);
  updateNeighbor(x, z + 1);
};

export const mutation = {
  build: {
    street: buildStreet,
  },
  destroy: {
    street: destroyStreet,
  },
};
