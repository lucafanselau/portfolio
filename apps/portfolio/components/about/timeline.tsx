import { Slot } from "@radix-ui/react-slot";
import {
  IconCircleCheck,
  IconCircleDashed,
  IconCircleDotted,
} from "@tabler/icons-react";
import { P } from "@ui/typography";
import { FC, ReactElement, ReactNode } from "react";

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
    <div className="w-full relative">
      <div
        className={
          "absolute left-[calc(1rem-1px)] inset-y-0 w-[2px] bg-current z-10"
        }
      />
      <div className={"flex flex-col space-y-2"}>
        {elements.map(({ title, content, subtitle, icon }, index) => (
          <div className={"flex space-x-2"} key={`timeline-element` + index}>
            <div className={"w-8 h-8 flex items-center justify-center z-20"}>
              <Slot className={"w-full h-full"}>
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
