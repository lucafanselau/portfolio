import { constants } from "@3d/constants";
import { findAssetEntry } from "@3d/generated-loader";
import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { Plane } from "@react-three/drei";
import type { ComponentPropsWithoutRef, FC } from "react";
import { forwardRef, useState } from "react";
import type { Mesh } from "three";
import { MeshStandardMaterial } from "three";
import { match, P } from "ts-pattern";
import type { BuildStateBuild } from "./types";

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

const BuildBuildPreview: FC<{ state: BuildStateBuild }> = ({
  state: payload,
}) => {
  return match(payload.payload)
    .with({ type: "streets" }, () => (
      <BuildPreviewPlane args={[tileSize, tileSize]} />
    ))
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
