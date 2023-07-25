import { constants } from "@3d/constants";
import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { OutlineEffect } from "./outline";
import { InteractionPlane } from "./overlay";
import { BuildPreview } from "./preview";

export const BuildModule = () => {
  const open = useStore(...selectors.state.build);
  if (!open) return null;
  return (
    <>
      <OutlineEffect />
      <group position={[0, -1 * constants.eps, 0]}>
        <InteractionPlane />
        <BuildPreview />
      </group>
    </>
  );
};
