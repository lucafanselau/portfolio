import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { animated, config, useSpring, SpringConfig } from "@react-spring/web";
import { ScrollArea } from "@ui/scroll-area";
import { cn } from "@ui/utils";
import type { FC, ReactNode } from "react";
import useMeasure from "react-use-measure";

const springConfig: SpringConfig = {
  ...config.stiff,
  bounce: 0.8,
  // mass: 5,
  // precision: 0.0001,
};

const getWindowHeight = () => {
  return (
    typeof window !== "undefined" &&
    (window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight)
  );
};

const clampHeight = (measured: number) => {
  const height = getWindowHeight();
  if (height) return Math.min(measured, Math.round(0.6 * height));
  else return measured;
};

export const ToolsSlidePanel: FC<{ children?: ReactNode }> = ({ children }) => {
  const open = useStore(...selectors.ui.open.slide);

  const [measureRef, { height }] = useMeasure();
  const clamped = clampHeight(height);
  const spring = useSpring({
    from: { top: 0 },
    to: { top: open ? -clamped : 0 },
    config: springConfig,
  });

  return (
    <div
      className={cn(
        // base layout
        "absolute inset-x-0 bottom-full w-full",
        // setup to compoensate for the radius of the toolbar
        "top-[calc(-100vh+var(--radius))] pt-[calc(100vh-var(--radius))] pb-[var(--radius)] ",
        // interaction
        "overflow-hidden",
        !open && "pointer-events-none"
      )}
    >
      <div className="relative">
        <animated.div
          style={spring}
          className={cn(
            // positioning / layout
            "absolute inset-x-0 h-screen bottom-full",
            // visual
            "card p-0"
          )}
        >
          <div>
            <ScrollArea
              className={"p-2 w-full"}
              // we are compensating for the border here
              style={{ height: clamped - 2 }}
            >
              <div ref={measureRef}>{children}</div>
            </ScrollArea>
            <div className="h-[2px] w-full flex-none bg-border" />
          </div>
        </animated.div>
      </div>
    </div>
  );
};

// DEPRECATED SECTION:
// NOTE: loved that the layout is that much smaller and concice, but the flex basis animation chokes on mobile

// NOTE: Ugly, but we need to add the padding of the card (2*8) to the height plus the divider (2)
const calcHeight = (content: number) => {
  const padded = content;
  const height =
    typeof window !== "undefined"
      ? window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
      : 0;
  if (height) return Math.min(padded, 0.6 * height);
  else return padded;
};

export const ToolsSlidePanelHeight: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const open = useStore(...selectors.ui.open.slide);

  const [measureRef, { height }] = useMeasure();
  const spring = useSpring({
    from: { flexBasis: 0 },
    to: { flexBasis: open ? calcHeight(height) : 0 },
    config: springConfig,
  });

  return (
    <>
      <animated.div className="overflow-hidden" style={spring}>
        <div className="h-[calc(100%-2px)] p-2">
          <ScrollArea className="h-full">
            <div className="w-full pr-4" ref={measureRef}>
              {children}
            </div>
          </ScrollArea>
        </div>
        <div className="h-[2px] w-full flex-none bg-border" />
      </animated.div>
    </>
  );
};
