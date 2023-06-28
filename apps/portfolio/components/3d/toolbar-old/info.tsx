import { ExploreBubbleContent, ExploreHome } from "@3d/story/explore";
import { animated, useSpring, useSpringRef, config } from "@react-spring/web";
import { IconInfoCircle } from "@tabler/icons-react";
import { Button } from "@ui/button";
import {
  CollapsibleTrigger,
  Collapsible,
  CollapsibleContent,
} from "@ui/collapsible";
import { cn } from "@ui/utils";
import { FC, ReactNode, useRef, useState } from "react";
import { match } from "ts-pattern";

export type SlideState = "closed" | "primary" | "open";

const targets = {
  closed: "100%",
  primary: "-50%",
  open: "0%",
} satisfies Record<SlideState, string>;

const InfoBoxOverlay: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in"></div>
  );
};

export const InfoBox: FC<{
  children: ReactNode;
  state: SlideState;
  onChange: (value: SlideState) => void;
}> = ({ children, onChange, state }) => {
  // const api = useSpringRef();
  const start = useRef(targets[state]);
  const spring = useSpring({
    // ref: api,
    from: { y: start.current },
    to: {
      y: targets[state],
    },
    config: {
      mass: 2,
      ...config.slow,
    },
  });

  // const onOpenChange = useCallback((value: boolean) => {
  // 	if (value) {
  // 		api.start({ y: "100%" });
  // 	} else {
  // 		api.start({ y: "0%" });
  // 	}
  // }, []);

  return (
    <Collapsible
      open={state !== "closed"}
      onOpenChange={(v) => onChange(v ? "open" : "closed")}
    >
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="icon">
          <IconInfoCircle />
        </Button>
      </CollapsibleTrigger>
      <div
        // NOTE: This might look complicated, but its basically just a container right abouve the toolbar extended to the height of the screen, but
        // with overflow hidden so that the content can be animated in and out of view
        className="absolute top-[var(--radius)] pb-[var(--radius)] pt-[100vh] -translate-y-full w-full left-0 right-0 overflow-hidden z-30"
        // py-[var(--radius)]
      >
        <CollapsibleContent forceMount asChild>
          <animated.div
            // className="mb-[var(--radius)]"
            className="relative"
            style={{
              transform: spring.y.to((v) => `translateY(${v})`),
            }}
          >
            <div
              className={cn(
                "card rounded-t-lg rounded-b-none border-b-0 flex flex-col space-y-2",
                state === "primary" && "rounded-b-lg"
              )}
            >
              {children}
              {state === "primary" && (
                <div className="flex justify-end items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onChange("closed")}
                  >
                    Dismiss
                  </Button>
                </div>
              )}
            </div>
            {/*NOTE: This div is only here to provide a background for the open animation*/}
            <div
              className={cn(
                "bg-background h-8 absolute -bottom-8 left-0 right-0 border-x-2 border-t-2",
                state === "primary" && "hidden"
              )}
            />
          </animated.div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export const InfoBoxLoader: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SlideState>("primary");

  return (
    <InfoBox state={state} onChange={setState}>
      {children}
    </InfoBox>
  );
};
