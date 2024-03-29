import { formatters } from "@components/formatters";
import { content } from "@content/index";
import { List } from "@ui/typography";
import type { FC } from "react";
import type { TimelineElement } from "./timeline";
import { Timeline } from "./timeline";

const elements = content.work.map((el): TimelineElement => {
  const isFinished = el.date[1].getTime() < Date.now();

  return {
    title: (
      <>
        <b>{el.company}</b> - {el.motto}
      </>
    ),
    subtitle: formatters.date(el.date[0]) + " - " + formatters.date(el.date[1]),
    content: <List className={"text-muted-foreground"} elements={el.bullets} />,
    icon: isFinished ? "finished" : "current",
  };
});

export const Work: FC = () => {
  return <Timeline elements={elements} />;
};
