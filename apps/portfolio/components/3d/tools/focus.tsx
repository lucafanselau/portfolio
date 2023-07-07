import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { animated, useSpring } from "@react-spring/web";
import { Button } from "@ui/button";
import { ScrollArea } from "@ui/scroll-area";
import { cn } from "@ui/utils";
import { FC, ReactNode, useCallback, useState } from "react";

export const ToolsFocusPanel: FC<{ children?: ReactNode }> = ({ children }) => {
  const open = useStore(...selectors.ui.open.focus);
  const [mounted, setMounted] = useState(open);
  const dismissable = useStore(...selectors.ui.dismissable);
  const springs = useSpring({
    from: { opacity: 0, transform: "scale(0%)" },
    to: {
      opacity: open ? 1 : 0,
      transform: open ? "scale(100%)" : "scale(0%)",
    },
    onStart: () => {
      if (open) setMounted(true);
    },
    onRest: () => {
      if (!open) setMounted(false);
    },
  });
  const onClick = useCallback(() => {
    useStore.getState().updateTools({ type: "dismiss" });
  }, []);

  //   if (!mounted) return null;

  return (
    <animated.div
      style={springs}
      className={cn(
        "card basis-auto min-h-0 mb-2 flex flex-col space-y-2",
        open && "pointer-events-auto"
      )}
    >
      <ScrollArea className="">
        <div id="popover-children">{children}</div>
      </ScrollArea>
      {dismissable && (
        <div id="popover-actions" className="flex justify-end">
          <Button
            onClick={onClick}
            size="sm"
            variant="muted"
            className="w-full"
          >
            Got it
          </Button>
        </div>
      )}
    </animated.div>
  );
};
