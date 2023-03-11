import { useHasMounted } from "@/hooks/has-mounted";
import { constants } from "@3d/constants";
import { shift, size, useFloating } from "@floating-ui/react-dom";
import { AppearCard } from "@ui/card";
import { FC, ReactNode, useEffect } from "react";

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
        padding: 16,
        apply({ availableWidth, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxWidth: `${availableWidth}px`,
            maxHeight: `calc(${
              availableHeight - constants.layout.headerSize
            }px - 1rem)`,
          });
        },
      }),

      shift({
        crossAxis: true,
      }),
    ],
  });
  const isMounted = useHasMounted();
  useEffect(update, [open, isMounted, header, content, action]);

  return (
    <div className={"relative"}>
      <div className={"absolute inset-0"} ref={refs.setReference} />
      <AppearCard
        open={open}
        ref={refs.setFloating}
        className={
          "p-4 md:p-8 w-[56ch] flex flex-col space-y-2 md:space-y-4 h-fit"
        }
        style={{
          top: y ?? 0,
          left: x ?? 0,
        }}
      >
        <div>{header}</div>
        <div className={"flex-0 min-h-0 pr-2 overflow-auto"}>{content}</div>
        <div className={"flex flex-row space-x-2 justify-end"}>{action}</div>
      </AppearCard>
    </div>
  );
};
