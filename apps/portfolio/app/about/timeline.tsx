import { IconCircleDot, IconCircleDotted } from "@tabler/icons-react";
import { P } from "@ui/typography";
import { FC, ReactNode } from "react";

export type TimelineElements = {
  title: ReactNode;
  content: ReactNode;
  date: ReactNode;
}[];

type TimelineProps = {
  elements: TimelineElements;
};

export const Timeline: FC<TimelineProps> = ({ elements }) => {
  return (
    <div className="w-full relative p-4 space-y-4">
      {elements.map(({ title, content, date }, index) => (
        <div className={"flex space-x-2"} key={`timeline-element` + index}>
          <div className={"w-8 h-8 flex items-center justify-center"}>
            <IconCircleDotted className={"bg-zinc-100 dark:bg-zinc-800"} />
          </div>

          <div className={"flex flex-col"}>
            <P className={"text-2xl"}>{title}</P>
            <P color={"lighter"}>{date}</P>
            <P>{content}</P>
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
