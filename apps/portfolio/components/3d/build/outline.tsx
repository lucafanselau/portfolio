import { useStore } from "@3d/store";
import { EffectComposer, Outline } from "@react-three/postprocessing";
import { OutlineEffect as EffectImpl } from "postprocessing";
import { useEffect, useRef } from "react";
import { selectors } from "./store/selector";

const [selector, eq] = selectors.hovered;
export const OutlineEffect = () => {
  const ref = useRef<EffectImpl>(null);

  useEffect(() => {
    return useStore.subscribe(
      selector,
      (hovered) => {
        ref.current?.selection.set(hovered);
      },
      { equalityFn: eq }
    );
  }, []);

  //       <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
  return (
    <EffectComposer autoClear={false}>
      <Outline
        // selection={hovered} // selection of objects that will be outlined
        // selectionLayer={10} // selection layer
        ref={ref}
        // blendFunction={BlendFunction.SCREEN} // set this to BlendFunction.ALPHA for dark outlines
        // patternTexture={null} // a pattern texture
        edgeStrength={2.5} // the edge strength
        pulseSpeed={0.0} // a pulse speed. A value of zero disables the pulse effect
        visibleEdgeColor={0xffffff} // the color of visible edges
        hiddenEdgeColor={0xffffff} // the color of hidden edges
        // width={Resizer.AUTO_SIZE} // render width
        // height={Resizer.AUTO_SIZE} // render height
        // kernelSize={KernelSize.LARGE} // blur kernel size
        blur={false} // whether the outline should be blurred
        xRay={true} // indicates whether X-Ray outlines are enabled
      />
    </EffectComposer>
  );
};
