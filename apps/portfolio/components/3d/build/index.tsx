import { constants } from "@3d/constants";
import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { OutlineEffect } from "./outline";
import { InteractionPlane } from "./overlay";
import { BuildPreview } from "./preview";

export const BuildModule = () => {
  const building = useStore(...selectors.ui.open.build);
  const open = useStore(...selectors.state.build);
  if (!building || !open) return null;
  return (
    <group position={[0, -1 * constants.eps, 0]}>
      <InteractionPlane />
      <OutlineEffect />
      <BuildPreview />
    </group>
  );
};
