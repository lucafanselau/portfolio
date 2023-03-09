import { autoUpdate, shift, size, useFloating } from "@floating-ui/react-dom";
import { AppearCard } from "@ui/card";
import { FC, PropsWithChildren } from "react";
import { constants } from "./constants";

export const SpeechBubble: FC<PropsWithChildren<{ open: boolean }>> = ({
  children,
  open,
}) => {
  // this is mf crazy, easy resizing on small deviced
  const { x, y, refs } = useFloating({
    placement: "top",
    whileElementsMounted: autoUpdate,
    middleware: [
      shift({
        crossAxis: true,
      }),
      size({
        padding: 8,
        apply({ availableWidth, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxWidth: `${availableWidth}px`,
            maxHeight: `${availableHeight - constants.layout.headerSize}px`,
          });
        },
      }),
    ],
  });

  return (
    <div className={"relative"}>
      <div className={"absolute inset-0 "} ref={refs.setReference} />
      <AppearCard
        open={open}
        ref={refs.setFloating}
        className={
          "p-4 md:p-8 pointer-events-none w-[56ch] flex flex-col space-y-2 h-fit"
        }
        style={{
          top: y ?? 0,
          left: x ?? 0,
        }}
      >
        {children}
      </AppearCard>
    </div>
  );
};
