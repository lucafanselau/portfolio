import { formatters } from "@components/formatters";
import { content } from "@content/index";
import { P } from "@ui/typography";
import type { FC } from "react";
import type { TimelineElement } from "./timeline";
import { Timeline } from "./timeline";

const elements = content.academic
  .sort((a, b) => b.date[0].getTime() - a.date[0].getTime())
  .map(({ grade, ...el }): TimelineElement => {
    const isFinished = el.date[1].getTime() < Date.now();

    let gradeText = `GPA ${grade.grade} (${grade.min} best, ${grade.max} worst)`;
    if (grade.quantile) {
      gradeText += ` - best ${grade.quantile * 100}% of class`;
    }

    return {
      title: (
        <>
          <b>{el.degree}</b> - {el.institution}
        </>
      ),
      subtitle:
        formatters.date(el.date[0]) + " - " + formatters.date(el.date[1]),
      content: (
        <div className="flex flex-col ">
          <P>{gradeText}</P>
          {el.note && <P size="sm">{el.note}</P>}
        </div>
      ),
      icon: isFinished ? "finished" : "current",
    };
  });

export const School: FC = () => {
  return <Timeline elements={elements} />;
};
