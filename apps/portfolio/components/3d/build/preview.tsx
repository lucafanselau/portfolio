import { constants } from "@3d/constants";
import { findAssetEntry } from "@3d/generated-loader";
import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { isNone } from "@components/utils";
import { Plane } from "@react-three/drei";
import { shallowEqual } from "fast-equals";
import { ComponentPropsWithoutRef, FC, useEffect, useRef } from "react";
import { forwardRef, useState } from "react";
import type { Mesh } from "three";
import { MeshStandardMaterial } from "three";
import { match, P } from "ts-pattern";
import type { BuildStateBuild } from "./types";
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

  // NOTE: positioning

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

const streetPosition = selectors.pack((s) => {
  const pointer = selectors.pointer[0](s);
  if (isNone(pointer)) return undefined;
  return point.tile.normalize(pointer);
}, point.eq);

const StreetsBuildPreviewPlane = () => {
  const ref = useRef<Mesh>(null);

  useEffect(() => {
    return useStore.subscribe(
      streetPosition[0],
      (p) => {
        console.log(p);
        if (!ref.current || isNone(p)) return;
        ref.current.position.set(p[0], 0, p[1]);
      },
      { equalityFn: streetPosition[1] }
    );
  }, []);

  return <BuildPreviewPlane ref={ref} args={[tileSize, tileSize]} />;
};

const BuildBuildPreview: FC<{ state: BuildStateBuild }> = ({
  state: payload,
}) => {
  return match(payload.payload)
    .with({ type: "streets" }, () => <StreetsBuildPreviewPlane />)
    .with({ type: P.union("buildings", "props") }, ({ type, id }) => {
      const entry = findAssetEntry(type, id);
      const extend = "extend" in entry ? entry.extend : [0.2, 0.2];
      return (
        <BuildPreviewPlane
          args={[extend[0] * tileSize, extend[1] * tileSize]}
        />
      );
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
