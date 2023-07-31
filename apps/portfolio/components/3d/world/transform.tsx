// ************************************
// TRANFORM COMPONENTS

import { Transform, coord } from "./coord";
import { constants } from "@3d/constants";
import { ComponentProps, forwardRef, ReactNode } from "react";
import { Plane } from "@react-three/drei";
import { Group } from "three";
import { BuildPreviewPlane } from "@3d/build/overlay";
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

      plane: enablePlane = true,
    },
    ref
  ) => {
    const { wrapper, plane } = transformProps(transform);
    return (
      <group ref={ref} {...wrapper}>
        {enablePlane && <BuildPreviewPlane entityId={id} {...plane} />}
        {children}
      </group>
    );
  }
);
