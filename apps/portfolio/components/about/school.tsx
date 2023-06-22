import { formatters } from "@components/formatters";
import { content } from "@content/index";
import { H2, P } from "@ui/typography";
import { FC } from "react";
import { Timeline, TimelineElement } from "./timeline";

const elements = content.academic.map(({ grade, ...el }): TimelineElement => {
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
    subtitle: formatters.date(el.date[0]) + " - " + formatters.date(el.date[1]),
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
  return (
    <>
      <H2>Academic background</H2>
      <Timeline elements={elements} />
    </>
  );
};
