import { constants } from "@3d/constants";
import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { useSubscribe } from "@3d/store/utils";
import { coord } from "@3d/world/coord";
import { useNonDragClick } from "@components/hooks/use-non-drag-click";
import { Plane } from "@react-three/drei";
import { invalidate, ThreeEvent } from "@react-three/fiber";
import { shallowEqual } from "fast-equals";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useRef,
  useState,
} from "react";
import type { Mesh } from "three";
import { MeshStandardMaterial } from "three";

const { tileSize, tiles } = constants.world;
const planeSize = tileSize * tiles;

export const InteractionPlane = () => {
  const interaction = useRef<Mesh>(null);
  const [material] = useState(
    () => new MeshStandardMaterial({ transparent: true, opacity: 0 })
  );

  const pointer = useNonDragClick<ThreeEvent<PointerEvent>>((e) => {
    useStore.getState().setPointer(coord.world.create(e.point.x, e.point.z));
  });

  return (
    <Plane
      ref={interaction}
      {...pointer}
      args={[planeSize, planeSize, 2, 2]}
      rotation={[-Math.PI / 2, 0, 0]}
      material={material}
    />
  );
};

// ******************************************************
// REUSABLE

const colors = {
  red: "#ef4444",
  green: "#10b981",
  blue: "#3b82f6",
};
type Color = keyof typeof colors;

const intersects = selectors.pack((s) => {
  if (
    s.ui.mode.type === "build" &&
    s.ui.mode.payload.type === "build" &&
    s.ui.mode.payload.payload.state.valid !== true
  )
    return s.ui.mode.payload.payload.state.valid.intersects;
  else return [];
}, shallowEqual);

export const BuildPreviewPlane = forwardRef<
  Mesh,
  ComponentPropsWithoutRef<typeof Plane> & { entityId?: string }
>(({ entityId, ...props }, ref) => {
  const [material] = useState(
    () =>
      new MeshStandardMaterial({
        depthTest: false,
        depthWrite: false,
        color: colors.green,
        transparent: true,
        opacity: 0.5,
      })
  );

  const handleIntersect = useCallback(
    (ids: string[]) => {
      if (entityId === undefined) return;
      if (ids.includes(entityId)) {
        material.color.set(colors.red);
      } else {
        material.color.set(colors.green);
      }
    },
    [entityId]
  );
  useSubscribe(intersects, handleIntersect);

  // load dynamic state, based on build
  useSubscribe(selectors.ui.open.build, (open) => {
    material.visible = open;
    invalidate();
  });

  return (
    <Plane
      {...props}
      ref={ref}
      receiveShadow
      renderOrder={999}
      material={material}
    />
  );
});
