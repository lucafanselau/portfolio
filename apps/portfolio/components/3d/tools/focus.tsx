import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { animated, useSpring } from "@react-spring/web";
import { Button } from "@ui/button";
import { cn } from "@ui/utils";
import { FC, ReactNode, useCallback } from "react";

export const ToolsFocusPanel: FC<{ children?: ReactNode }> = ({ children }) => {
  const open = useStore(...selectors.ui.open.focus);
  const dismissable = useStore(...selectors.ui.dismissable);
  const springs = useSpring({
    from: { opacity: 0, transform: "scale(0%)" },
    to: {
      opacity: open ? 1 : 0,
      transform: open ? "scale(100%)" : "scale(0%)",
    },
  });
  const onClick = useCallback(() => {
    useStore.getState().updateTools({ type: "dismiss" });
  }, []);

  return (
    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
      <animated.div
        style={springs}
        className={cn(
          "card flex flex-col space-y-2",
          open && "pointer-events-auto"
        )}
      >
        <div id="popover-children">{children}</div>
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
    </div>
  );
};
