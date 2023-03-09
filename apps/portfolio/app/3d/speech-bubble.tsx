import { autoUpdate, shift, size, useFloating } from "@floating-ui/react-dom";
import { AppearCard } from "@ui/card";
import { FC, PropsWithChildren } from "react";

export const SpeechBubble: FC<PropsWithChildren<{ open: boolean }>> = ({
  children,
  open,
}) => {
  // this is mf crazy, easy resizing on small deviced
  const { x, y, refs } = useFloating({
    placement: "top",
    whileElementsMounted: autoUpdate,
    middleware: [
      shift(),
      size({
        padding: 8,
        apply({ availableWidth, elements }) {
          Object.assign(elements.floating.style, {
            maxWidth: `${availableWidth}px`,
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
        className={"pointer-events-none w-[56ch] flex flex-col space-y-2 h-fit"}
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
