import { useStore } from "@3d/store";
import { animated, useSpring } from "@react-spring/web";
import { Button } from "@ui/button";
import { FC, ReactNode } from "react";
import { isFocusPanelOpen } from "./selectors";

export const ToolsFocusPanel: FC<{ children?: ReactNode }> = ({ children }) => {
  const open = useStore(isFocusPanelOpen);

  const springs = useSpring({
    from: { opacity: 0, transform: "scale(0%)" },
    to: {
      opacity: open ? 1 : 0,
      transform: open ? "scale(100%)" : "scale(0%)",
    },
  });

  return (
    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
      <animated.div style={springs} className="card flex flex-col space-y-2">
        <div id="popover-children">{children}</div>
        <div id="popover-actions" className="flex justify-end">
          <Button size="sm" variant="muted">
            Dismiss
          </Button>
        </div>
      </animated.div>
    </div>
  );
};
