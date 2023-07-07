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

// NOTE: Ugly, but we need to add the padding of the card (2*8) to the height plus the divider (2)
const calcHeight = (content: number) => {
  const padded = content + 2 + 2 * 8;
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
            <div className="pr-4 w-full" ref={measureRef}>
              {children}
            </div>
          </ScrollArea>
        </div>
        <div className="h-[2px] flex-none bg-border w-full" />
      </animated.div>
    </>
  );
};
