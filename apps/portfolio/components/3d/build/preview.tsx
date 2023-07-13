import { constants } from "@3d/constants";
import { AssetEntry, findAssetEntry, PropLoader } from "@3d/generated-loader";
import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { Store } from "@3d/store/store";
import { coord, TileRange } from "@3d/world/coord";
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

const { tileSize } = constants.world;

// ******************************************************
// STREETS

const streetPosition = selectors.pack((s) => {
  const pointer = selectors.pointer[0](s);
  if (isNone(pointer)) return undefined;
  // const [x, z] = point.tile.normalize(pointer);
  // return [x + tileSize / 2, z + tileSize / 2] as [number, number];
  return pointer;
  // TODO: eql
});

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
const isValidBuilding = (range: TileRange) => {
  const buildings = useStore.getState().world.buildings;
  coord.range.box(range, _current);
  for (const building of buildings) {
    coord.range.box(building.range, _check);
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
  const building = useMemo((): Omit<Building, "range"> => {
    return {
      id: "building-preview",
      type,
    };
  }, [type]);
  const [color, setColor] = useState<Color>("blue");
  const [range, setRange] = useState<TileRange>(
    coord.range.create(coord.world.create(0, 0))
  );

  useEffect(() => {
    return useStore.subscribe(
      buildPosition[0],
      (p) => {
        if (!ref.current || isNone(p)) return;
        // ref.current.position.set(p[0], 0, p[1]);
        const value = coord.range.building(
          coord.world.create(p[0], p[1]),
          type,
          0
        );
        setRange(value);

        // NOTE: Handle valid of building this
        useStore.setState((s) => {
          if (!isMatching(buildingStatePattern, s)) return;
          const isValid = isValidBuilding(value, type);
          s.ui.mode.payload.payload.state.invalid = !isValid;
          setColor(isValid ? "green" : "red");
        });
      },
      { equalityFn: buildPosition[1] }
    );
  }, [type]);

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
      <BuildingLoader {...building} range={range} />
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
