import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { animated, useSpring } from "@react-spring/web";
import { Button } from "@ui/button";
import { ScrollArea } from "@ui/scroll-area";
import { cn } from "@ui/utils";
import type { FC, ReactNode } from "react";
import { useCallback } from "react";
import { springConfig } from "./slide";

export const ToolsFocusPanel: FC<{ children?: ReactNode }> = ({ children }) => {
  const open = useStore(...selectors.ui.open.focus);
  // const [mounted, setMounted] = useState(open);
  const dismissable = useStore(...selectors.ui.dismissable);
  const springs = useSpring({
    // starting opened, since this is the case at startup
    from: { opacity: 1, transform: "scale(100%)" },
    to: {
      opacity: open ? 1 : 0,
      transform: open ? "scale(100%)" : "scale(0%)",
    },
    config: springConfig,
  });
  const onClick = useCallback(() => {
    useStore.getState().updateTools({ type: "dismiss" });
  }, []);

  // if (!mounted) return null;

  return (
    <animated.div
      style={springs}
      className={cn(
        // NOTE: mb-2 is for the popover to be nicely spaced to the toolbar
        "card mb-2 flex min-h-0 basis-auto flex-col space-y-2 p-2",
        open && "pointer-events-auto"
      )}
    >
      <ScrollArea className="h-full">
        <div id="popover-children" className="w-full pr-4">
          {children}
        </div>
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
