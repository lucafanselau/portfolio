import { constants } from "@3d/constants";
import {
  AssetEntry,
  BuildingLoader,
  findAssetEntry,
  PropLoader,
} from "@3d/generated-loader";
import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { Store } from "@3d/store/store";
import { Building, BuildingType, Prop, PropType } from "@3d/world/types";
import { isNone } from "@components/utils";
import { Plane } from "@react-three/drei";
import { shallowEqual } from "fast-equals";
import { ComponentPropsWithoutRef, FC, useEffect, useRef } from "react";
import { forwardRef, useState, useMemo } from "react";
import { Box2, Group, Mesh, Vector2, Vector3 } from "three";
import { MeshStandardMaterial } from "three";
import { isMatching, match, P, Pattern } from "ts-pattern";
import { buildEntry, BuildStateBuild } from "./types";
import { Point, point } from "./utils";

const { tileSize } = constants.world;

// ******************************************************
// REUSABLE

const colors = {
  red: "#ef4444",
  green: "#10b981",
  blue: "#3b82f6",
};
type Color = keyof typeof colors;

export const BuildPreviewPlane = forwardRef<
  Mesh,
  ComponentPropsWithoutRef<typeof Plane> & {
    depthTest?: boolean;
    color?: Color;
  }
>(({ depthTest = false, color = "blue", ...props }, ref) => {
  const [material] = useState(
    () =>
      new MeshStandardMaterial({
        depthTest,
        transparent: true,
        opacity: 0.5,
      })
  );

  useEffect(() => {
    material.color.set(colors[color]);
  }, [color]);

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

const _current = new Box2(new Vector2(), new Vector2());
const _check = new Box2(new Vector2(), new Vector2());
const _zero = new Vector2(0, 0);
const _setBox2 = (v: Box2, p: Point, type: BuildingType, rotation: number) => {
  const entry = findAssetEntry("buildings", type);
  v.min.set(p[0], p[1]);
  v.max.set(
    p[0] + entry.extend[0] * tileSize - constants.eps,
    p[1] + entry.extend[1] * tileSize - constants.eps
  );
  console.log(v.min.x, v.min.y, v.max.x, v.max.y);
  v.min.rotateAround(v.min, (rotation * Math.PI) / 2);
  v.max.rotateAround(v.min, (rotation * Math.PI) / 2);
  console.log(v.min.x, v.min.y, v.max.x, v.max.y);
};
const isValidBuilding = (
  point: Point,
  type: BuildingType,
  rotation: number
) => {
  _setBox2(_current, point, type, rotation);
  console.log(_current);
  const buildings = useStore.getState().world.buildings;
  for (const building of buildings) {
    console.log(building);
    _setBox2(
      _check,
      [building.position.x, building.position.z],
      building.type,
      building.rotation
    );
    if (_current.intersectsBox(_check)) return false;
  }
  return true;
};

const buildingStatePattern = {
  ui: {
    mode: {
      type: "build",
      payload: { type: "build", payload: { type: "buildings" } },
    },
  },
} satisfies Pattern.Pattern<Store>;

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
  const [color, setColor] = useState<Color>("blue");

  useEffect(() => {
    return useStore.subscribe(
      buildPosition[0],
      (p) => {
        if (!ref.current || isNone(p)) return;
        ref.current.position.set(p[0], 0, p[1]);

        // NOTE: Handle valid of building this
        useStore.setState((s) => {
          if (!isMatching(buildingStatePattern, s)) return;
          const isValid = isValidBuilding(p, type, building.rotation);
          s.ui.mode.payload.payload.state.invalid = !isValid;
          setColor(isValid ? "green" : "red");
        });
      },
      { equalityFn: buildPosition[1] }
    );
  }, []);

  if (isNone(entry)) return null;
  const extend = entry.extend;
  const size = [tileSize * extend[0], tileSize * extend[1]] as [number, number];

  return (
    <group ref={ref}>
      <BuildPreviewPlane
        color={color}
        args={size}
        position={[size[0] / 2, 0, size[1] / 2]}
      />
      <BuildingLoader plane={false} {...building} />
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
