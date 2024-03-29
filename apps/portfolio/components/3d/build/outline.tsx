import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { invalidate } from "@react-three/fiber";
import { EffectComposer, Outline } from "@react-three/postprocessing";
import type { OutlineEffect as EffectImpl } from "postprocessing";
import { useEffect, useRef } from "react";

const [selector, eq] = selectors.hovered;
export const OutlineEffect = () => {
  const ref = useRef<EffectImpl>(null);
  const open = true; // useStore(...selectors.ui.open.outline);

  useEffect(() => {
    if (!open) ref.current?.selection.clear();
    else
      ref.current?.selection.set(
        selector(useStore.getState()).map(([h, _]) => h)
      );

    // kick off at least one frame
    invalidate();

    return useStore.subscribe(
      selector,
      (hovered) => {
        if (open) {
          ref.current?.selection.set(hovered.map(([h, _]) => h));
          invalidate();
        }
      },
      { equalityFn: eq }
    );
  }, [open]);

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
