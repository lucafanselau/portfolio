import { IconCircleDot, IconCircleDotted } from "@tabler/icons-react";
import { P } from "@ui/typography";
import { FC, ReactNode } from "react";

export type TimelineElements = {
  title: ReactNode;
  content: ReactNode;
  date:
    | {
        start: Date;
        end?: Date;
      }
    | Date;
}[];

type TimelineProps = {
  elements: TimelineElements;
};

const formatter = new Intl.DateTimeFormat("en", {
  month: "long",
  year: "numeric",
});
const dateFormat = (date: Date) => {
  return formatter.format(date);
};

export const Timeline: FC<TimelineProps> = ({ elements }) => {
  return (
    <div className="w-full relative p-4 space-y-4">
      {elements.map(({ title, content, date }, index) => (
        <div className={"flex space-x-2"} key={`timeline-element` + index}>
          <div className={"w-8 h-8 flex items-center justify-center"}>
            <IconCircleDotted className={"bg-background"} />
          </div>

          <div className={"flex flex-col"}>
            <P className={"text-xl"}>{title}</P>
            <P color={"lighter"} size="xs">
              {date instanceof Date ? dateFormat(date) : dateFormat(date.start)}
            </P>
            <P size="sm">{content}</P>
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
