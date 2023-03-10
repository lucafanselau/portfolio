import { useHasMounted } from "@/hooks/has-mounted";
import { constants } from "@3d/constants";
import { shift, size, useFloating } from "@floating-ui/react-dom";
import { AppearCard } from "@ui/card";
import { FC, PropsWithChildren, ReactNode, useEffect } from "react";

export const SpeechBubble: FC<
  { open: boolean } & Record<
    "header" | "content" | "action",
    ReactNode | undefined
  >
> = ({ header, content, action, open }) => {
  // this is mf crazy, easy resizing on small deviced
  const { x, y, refs, update } = useFloating({
    placement: "top",
    // whileElementsMounted: autoUpdate,
    middleware: [
      size({
        padding: 8,
        apply({ availableWidth, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxWidth: `${availableWidth}px`,
            maxHeight: `${availableHeight - constants.layout.headerSize - 8}px`,
          });
        },
      }),

      shift({
        crossAxis: true,
      }),
    ],
  });
  const isMounted = useHasMounted();

  useEffect(update, [open, isMounted]);

  return (
    <div className={"relative"}>
      <div className={"absolute inset-0 "} ref={refs.setReference} />
      <AppearCard
        open={open}
        ref={refs.setFloating}
        className={
          "p-4 md:p-8 w-[56ch] flex flex-col space-y-2 md:space-y-4 h-fit overflow-auto"
        }
        style={{
          top: y ?? 0,
          left: x ?? 0,
        }}
      >
        <div>{header}</div>
        <div className={"flex-0 min-h-0 overflow-auto pr-2"}>{content}</div>
        <div className={"flex flex-row space-x-2 justify-end"}>{action}</div>
      </AppearCard>
    </div>
  );
};
