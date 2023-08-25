// ************************************
// TRANFORM COMPONENTS

import { BuildPreviewPlane } from "@3d/build/overlay";
import { constants } from "@3d/constants";
import { Plane } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import { ComponentProps, forwardRef, ReactNode } from "react";
import { Group } from "three";
import { coord, Transform } from "./coord";
const { unwrap, world, plane } = coord;

const transformProps = (transform: Transform) => {
  const [x, z] = unwrap(world.from(transform.anchor));
  const [w, d] = unwrap(plane.from(transform.extend));
  return {
    wrapper: {
      position: [x, 0, z],
      rotation: [0, (transform.rotation * Math.PI) / 2, 0],
    },
    plane: {
      args: [w, d, 2, 2],
      rotation: [-Math.PI / 2, 0, 0],
      position: [0, constants.eps, 0],
    },
  } satisfies Record<string, ComponentProps<typeof Plane>>;
};

export const TransformLoader = forwardRef<
  Group,
  {
    transform: Transform;
    children?: ReactNode;
    id: string;

    scale?: GroupProps["scale"];

    // config stuff
    plane?: boolean; // enable plane
    planeProps?: boolean; // treat children like a plane
  }
>(
  (
    {
      transform,
      children,
      id,
      scale,

      plane: enablePlane = true,
    },
    ref
  ) => {
    const { wrapper, plane } = transformProps(transform);
    return (
      <group scale={scale} ref={ref} {...wrapper}>
        {enablePlane && <BuildPreviewPlane entityId={id} {...plane} />}
        {children}
      </group>
    );
  }
);
