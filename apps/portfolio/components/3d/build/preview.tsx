import { constants } from "@3d/constants";
import {
  AssetEntry,
  BuildingLoader,
  findAssetEntry,
  PropLoader,
} from "@3d/generated-loader";
import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { Building, BuildingType, Prop, PropType } from "@3d/world/types";
import { isNone } from "@components/utils";
import { Plane } from "@react-three/drei";
import { shallowEqual } from "fast-equals";
import { ComponentPropsWithoutRef, FC, useEffect, useRef } from "react";
import { forwardRef, useState, useMemo } from "react";
import { Group, Mesh, Vector3 } from "three";
import { MeshStandardMaterial } from "three";
import { match, P } from "ts-pattern";
import { buildEntry, BuildStateBuild } from "./types";
import { point } from "./utils";

/*
  const entry = useStore(...selectors.entry);
  if (isNone(entry)) return null;
  const extend =
    "extend" in entry
      ? (entry.extend as [number, number])
      : ([1, 1] as [number, number]);

 */

const { tileSize } = constants.world;

// ******************************************************
// REUSABLE

const BuildPreviewPlane = forwardRef<
  Mesh,
  ComponentPropsWithoutRef<typeof Plane>
>(({ ...props }, ref) => {
  const [material] = useState(
    () =>
      new MeshStandardMaterial({
        color: "#3b82f6", // green[800],
        depthTest: false,
        transparent: true,
        opacity: 0.5,
      })
  );

  return (
    <Plane
      {...props}
      ref={ref}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      material={material}
    />
  );
});

// ******************************************************
// STREETS

const streetPosition = selectors.pack((s) => {
  const pointer = selectors.pointer[0](s);
  if (isNone(pointer)) return undefined;
  const [x, z] = point.tile.normalize(pointer);
  return [x + tileSize / 2, z + tileSize / 2] as [number, number];
}, point.eq);

const StreetsBuildPreviewPlane = () => {
  const ref = useRef<Mesh>(null);

  useEffect(() => {
    return useStore.subscribe(
      streetPosition[0],
      (p) => {
        if (!ref.current || isNone(p)) return;
        // NOTE: drag build call (weird position for that)
        const { build, pointerDown } = useStore.getState();
        if (pointerDown) build("drag");
        ref.current.position.set(p[0], 0, p[1]);
      },
      { equalityFn: streetPosition[1] }
    );
  }, []);

  return <BuildPreviewPlane ref={ref} args={[tileSize, tileSize]} />;
};

// ******************************************************
// BUILDINGS

export const buildPosition = selectors.pack((s) => {
  const pointer = selectors.pointer[0](s);
  const entry = buildEntry[0](s) as AssetEntry<"buildings">;
  if (isNone(pointer) || isNone(entry)) return undefined;
  const extend = entry.extend;
  return point.tile.normalize([
    pointer[0] - (extend[0] * tileSize) / 2,
    pointer[1] - (extend[1] * tileSize) / 2,
  ]);
}, point.eq);

const BuildingBuildPreviewPlane: FC<{ type: BuildingType }> = ({ type }) => {
  const ref = useRef<Group>(null);
  const entry = useMemo(() => findAssetEntry("buildings", type), [type]);
  const building = useMemo((): Building => {
    return {
      id: "building-preview",
      type,
      position: new Vector3(),
      rotation: 0,
    };
  }, [entry]);

  useEffect(() => {
    return useStore.subscribe(
      buildPosition[0],
      (p) => {
        console.log(p);
        if (!ref.current || isNone(p)) return;
        ref.current.position.set(p[0], 0, p[1]);
      },
      { equalityFn: buildPosition[1] }
    );
  }, []);

  if (isNone(entry)) return null;
  const extend = entry.extend;
  const size = [tileSize * extend[0], tileSize * extend[1]] as [number, number];

  return (
    <group ref={ref}>
      <BuildPreviewPlane args={size} position={[size[0] / 2, 0, size[1] / 2]} />
      <BuildingLoader {...building} />
    </group>
  );
};

// ******************************************************
// PROPS

export const propsPosition = selectors.pointer;

const PropsBuildPreviewPlane: FC<{ type: PropType }> = ({ type }) => {
  const ref = useRef<Group>(null);

  useEffect(() => {
    return useStore.subscribe(
      propsPosition[0],
      (p) => {
        if (!ref.current || isNone(p)) return;
        ref.current.position.set(p[0], 0, p[1]);
      },
      { equalityFn: propsPosition[1] }
    );
  }, []);

  const prop = useMemo(
    (): Prop => ({
      id: "prop-preview",
      type,
      position: new Vector3(),
      rotation: 0,
    }),
    []
  );

  return (
    <group ref={ref}>
      <BuildPreviewPlane args={[2, 2]} />
      <PropLoader {...prop} />
    </group>
  );
};

// ******************************************************
// LOADER

const BuildBuildPreview: FC<{ state: BuildStateBuild }> = ({
  state: payload,
}) => {
  return match(payload.payload)
    .with({ type: "streets" }, () => <StreetsBuildPreviewPlane />)
    .with({ type: "buildings" }, ({ id }) => {
      return <BuildingBuildPreviewPlane type={id} />;
    })
    .with({ type: "props" }, ({ id }) => {
      return <PropsBuildPreviewPlane type={id} />;
    })
    .exhaustive();
};

export const BuildPreview = () => {
  const build = useStore(...selectors.ui.build);

  return (
    match(build)
      .with({ type: "build" }, (state) => <BuildBuildPreview state={state} />)
      // destroy is handled by the outline effect
      .otherwise(() => null)
  );
};
