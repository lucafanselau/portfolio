import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { animated, config, useSpring } from "@react-spring/web";
import { ScrollArea } from "@ui/scroll-area";
import { cn } from "@ui/utils";
import { FC, ReactNode } from "react";
import useMeasure from "react-use-measure";

const targets = {
  open: "0%",
  closed: "100%",
};

const springConfig = {
  mass: 2,
  precision: 0.0001,
  ...config.slow,
};

export const ToolsSlidePanel: FC<{ children?: ReactNode }> = ({ children }) => {
  const open = useStore(...selectors.ui.open.slide);

  const spring = useSpring({
    from: { y: targets["closed"] },
    to: { y: targets[open ? "open" : "closed"] },
    config: springConfig,
  });

  return (
    <div
      // NOTE: This might look complicated, but its basically just a container right abouve the toolbar extended to the height of the screen, but
      // with overflow hidden so that the content can be animated in and out of view
      className="absolute top-[var(--radius)] pb-[var(--radius)] pt-[100vh] -translate-y-full w-full left-0 right-0 overflow-hidden z-30 pointer-events-none"
      // py-[var(--radius)]
    >
      <animated.div
        // className="mb-[var(--radius)]"
        className="relative"
        style={{
          transform: spring.y.to((v) => `translateY(${v})`),
        }}
      >
        <div
          className={cn(
            "card rounded-t-lg rounded-b-none border-b-0 flex flex-col space-y-2 pointer-events-auto"
          )}
        >
          {children}
        </div>
        {/*NOTE: This div is only here to provide a background for the open animation*/}
        <div
          className={cn(
            "bg-background h-8 absolute -bottom-8 left-0 right-0 border-x-2 border-t-2"
          )}
        />
      </animated.div>
    </div>
  );
};

const AnimatedScrollArea = animated(ScrollArea);

export const ToolsSlidePanelHeight: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const open = useStore(...selectors.ui.open.slide);

  const [measureRef, { height }] = useMeasure();
  const spring = useSpring({
    from: { flexBasis: 0 },
    to: { flexBasis: open ? height : 0 },
    config: springConfig,
  });

  return (
    <>
      <AnimatedScrollArea
        className="grow-0 shrink overflow-y-auto"
        style={spring}
      >
        <div className="flex flex-col p-2 md:p-4 w-full" ref={measureRef}>
          {children}
        </div>
      </AnimatedScrollArea>
      {open && <div className="h-[2px] bg-border w-full" />}
    </>
  );
};
