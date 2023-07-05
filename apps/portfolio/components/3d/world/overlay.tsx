import { constants } from "@3d/constants";
import { Plane } from "@react-three/drei";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { green } from "tailwindcss/colors";
import { Mesh, MeshStandardMaterial, Vector3 } from "three";
import { normalizeTile } from ".";
import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { isNone } from "@components/utils";
import { MeshProps, ThreeEvent, useFrame } from "@react-three/fiber";
import collection from "@3d/generated/collection.json";

const { tileSize, tiles } = constants.world;
const planeSize = tileSize * tiles;

const toTile = (x: number) => {
  return Math.floor(x / tileSize) + tiles / 2;
};

const Overlay = forwardRef<Mesh, MeshProps>(({ ...props }, ref) => {
  const [material] = useState(
    () =>
      new MeshStandardMaterial({
        color: green[800],
        depthTest: false,
        transparent: true,
        opacity: 0.5,
      })
  );

  const entry = useStore(...selectors.entry);
  if (isNone(entry)) return null;
  const extend =
    "extend" in entry
      ? (entry.extend as [number, number])
      : ([1, 1] as [number, number]);

  return (
    <Plane
      {...props}
      ref={ref}
      args={[tileSize * extend[0], tileSize * extend[1], 2, 2]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      material={material}
    />
  );
});

type Point = [number, number];
const toTileCoord = (vec: Vector3): Point => {
  return [toTile(vec.x), toTile(vec.z)];
};

const pointEq = (a: Point, b: Point) => {
  return a[0] === b[0] && a[1] === b[1];
};

export const BuildInteractionOverlay = () => {
  const settings = useStore(...selectors.ui.build);

  const [material] = useState(
    () => new MeshStandardMaterial({ transparent: true, opacity: 0 })
  );

  const interaction = useRef<Mesh>(null);
  const overlay = useRef<Mesh>(null);
  const active = useRef<boolean>(false);

  useFrame(() => {
    if (!settings || !interaction.current || !overlay.current) return;

    const { pointer } = useStore.getState();
    if (!pointer) return;
    const [x, z] = pointer.map((x) => normalizeTile(x));
    overlay.current.position.set(x, 0, z);
  });

  useEffect(() => {
    // handle drag build
    return useStore.subscribe(
      (s) => s.pointer ?? ([0, 0] as Point),
      (point) => {
        if (active.current) useStore.getState().build();
      },
      {
        equalityFn: pointEq,
      }
    );
  }, [active]);

  const onPointer = (e: ThreeEvent<PointerEvent>) => {
    if (!e.point) return;
    useStore.getState().setPointer(toTileCoord(e.point));
  };

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    active.current = true;
    onPointer(e);
    useStore.getState().build();
  };

  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    active.current = false;
    onPointer(e);
  };

  if (isNone(settings)) return null;

  return (
    <group renderOrder={9999} position={[0, -1 * constants.eps, 0]}>
      <Plane
        ref={interaction}
        onPointerMove={onPointer}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
        args={[planeSize, planeSize, 2, 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={material}
      />
      <Overlay ref={overlay} />
    </group>
  );
};
