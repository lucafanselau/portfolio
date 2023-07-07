import { Slot } from "@radix-ui/react-slot";
import {
  IconCircleCheck,
  IconCircleDashed,
  IconCircleDotted,
} from "@tabler/icons-react";
import { P } from "@ui/typography";
import type { FC, ReactElement, ReactNode } from "react";

type PrefabIcon = "finished" | "current" | "future";

const PrefabIconLoader: FC<{ icon: PrefabIcon }> = ({ icon }) => {
  switch (icon) {
    case "finished":
      return <IconCircleCheck size={32} className={"bg-background"} />;
    case "current":
      return <IconCircleDashed size={32} className={"bg-background"} />;
    case "future":
      return <IconCircleDotted size={32} className={"bg-background"} />;
  }
};

export type TimelineElement = {
  title: ReactNode;
  subtitle: ReactNode;
  content: ReactNode;
  icon: PrefabIcon | ReactElement;
};

type TimelineProps = {
  elements: TimelineElement[];
};

export const Timeline: FC<TimelineProps> = ({ elements }) => {
  return (
    <div className="relative w-full">
      <div
        className={
          "absolute inset-y-0 left-[calc(1rem-1px)] z-10 w-[2px] bg-current"
        }
      />
      <div className={"flex flex-col space-y-2"}>
        {elements.map(({ title, content, subtitle, icon }, index) => (
          <div
            className={"flex space-x-2"}
            key={`timeline-element` + index.toString()}
          >
            <div className={"z-20 flex h-8 w-8 items-center justify-center"}>
              <Slot className={"h-full w-full"}>
                {typeof icon === "string" ? (
                  <PrefabIconLoader icon={icon} />
                ) : (
                  icon
                )}
              </Slot>
            </div>

            <div className={"flex flex-col space-y-2"}>
              <P className={"align-middle"} size={"base"}>
                {title}
              </P>
              <P color={"lighter"} size="xs">
                {subtitle}
              </P>
              {content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
