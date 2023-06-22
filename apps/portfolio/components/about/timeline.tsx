import {
  IconCircleCheck,
  IconCircleDashed,
  IconCircleDot,
  IconCircleDotted,
} from "@tabler/icons-react";
import { P } from "@ui/typography";
import { FC, ReactElement, ReactNode } from "react";

type PrefabIcon = "finished" | "current" | "future";

const PrefabIconLoader: FC<{ icon: PrefabIcon }> = ({ icon }) => {
  switch (icon) {
    case "finished":
      return <IconCircleCheck className={"bg-background"} />;
    case "current":
      return <IconCircleDashed className={"bg-background"} />;
    case "future":
      return <IconCircleDotted className={"bg-background"} />;
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
    <div className="w-full relative p-4 space-y-4">
      {elements.map(({ title, content, subtitle, icon }, index) => (
        <div className={"flex space-x-2"} key={`timeline-element` + index}>
          <div className={"w-8 h-8 flex items-center justify-center"}>
            {typeof icon === "string" ? <PrefabIconLoader icon={icon} /> : icon}
          </div>

          <div className={"flex flex-col space-y-2"}>
            <P className={"text-xl leading-8 align-middle"}>{title}</P>
            <P color={"lighter"} size="xs">
              {subtitle}
            </P>
            {content}
          </div>
        </div>
      ))}
      <div
        className={
          "absolute left-[31px] top-[15px] bottom-[15px] w-[2px]  bg-current -z-10"
        }
      />
    </div>
  );
};
