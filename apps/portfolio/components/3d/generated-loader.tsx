import collection from "@3d/generated/collection.json";
// import { Instances } from "@3d/generated/index";
import { models } from "@3d/generated/loader";
import { useStore } from "@3d/store";
import { isNone } from "@components/utils";
import { GroupProps } from "@react-three/fiber";
import { FC, ReactNode, useMemo, useRef } from "react";
import { Group } from "three";
import { constants, Unwrap } from "./constants";
import { Building, Prop } from "./world/types";

export type GeneratedKeys = keyof typeof collection;
type GeneratedEntry<Keys extends GeneratedKeys = GeneratedKeys> = Unwrap<
  (typeof collection)[Keys]
>;

export const GeneratedLoader: FC<{ children?: ReactNode }> = ({ children }) => {
  // NOTE: currently instances are turned off
  return <>{children}</>;
  // return <Instances>{children}</Instances>;
};

export const BuildingLoader: FC<Building> = ({
  type,
  rotation: rot,
  position,
}) => {
  const ref = useRef<Group>(null);
  const entry = useMemo(
    () => collection["buildings"].find((e) => e.id === type),
    [type]
  );

  const Model = models["buildings"]?.[type];

  const { rotation, ...props } = useMemo((): GroupProps => {
    const [width, depth] = entry?.extend ?? [1, 1];
    const { tileSize } = constants.world;

    return {
      position: [(width / 2) * tileSize, 0, (depth / 2) * tileSize] as const,
      rotation: [0, (rot * Math.PI) / 2, 0] as [number, number, number],
      onPointerOver: (e) =>
        useStore.setState((s) => void s.world.hovered.push(e.object)),
      onPointerOut: (e) =>
        useStore.setState(
          (s) =>
            void (s.world.hovered = s.world.hovered.filter(
              (h) => h !== e.object
            ))
        ),
    };
  }, [type, rot]);

  if (isNone(Model)) return null;
  return (
    <group position={position}>
      <group rotation={rotation}>
        <Model ref={ref} {...props} />
      </group>
    </group>
  );
};

export const Buildings = () => {
  const buildings = useStore((state) => state.world.buildings);

  return (
    <>
      {buildings.map((building) => (
        <BuildingLoader key={building.id} {...building} />
      ))}
    </>
  );
};

export const PropLoader: FC<Prop> = ({ type, rotation, position }) => {
  const Model = models["props"]?.[type];
  if (isNone(Model)) return null;

  return (
    <Model position={position} rotation={[0, (rotation * Math.PI) / 2, 0]} />
  );
};

export const Props = () => {
  const props = useStore((state) => state.world.props);

  return (
    <>
      {props.map((prop) => (
        <PropLoader key={prop.id} {...prop} />
      ))}
    </>
  );
};
