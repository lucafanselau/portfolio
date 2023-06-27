import { ExploreBubbleContent, ExploreHome } from "@3d/story/explore";
import { animated, useSpring, useSpringRef, config } from "@react-spring/web";
import { IconInfoCircle } from "@tabler/icons-react";
import { Button } from "@ui/button";
import {
  CollapsibleTrigger,
  Collapsible,
  CollapsibleContent,
} from "@ui/collapsible";
import { FC, ReactNode, useCallback } from "react";

const InfoSlide: FC = () => {
  return null;
};

export const InfoBox: FC<{ children: ReactNode }> = ({ children }) => {
  const api = useSpringRef();
  const spring = useSpring({
    ref: api,
    from: { y: "0%" },
    config: config.wobbly,
  });

  const onOpenChange = useCallback((value: boolean) => {
    if (value) {
      api.start({ y: "100%" });
    } else {
      api.start({ y: "0%" });
    }
  }, []);

  return (
    <Collapsible onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="icon">
          <IconInfoCircle />
        </Button>
      </CollapsibleTrigger>
      <div
        className="absolute top-[var(--radius)] pb-[var(--radius)] -translate-y-full w-full left-0 right-0 overflow-hidden z-30"
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
            <div className="card rounded-t-lg rounded-b-none border-b-0">
              {children}
            </div>
            {/*NOTE: This div is only here to provide a background for the open animation*/}
            <div className="bg-background h-8 absolute -bottom-8 left-0 right-0 border-x-2 border-t-2" />
          </animated.div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
