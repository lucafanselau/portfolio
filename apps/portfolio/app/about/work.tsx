import { H2, P } from "@ui/typography";
import { FC } from "react";
import { Timeline, TimelineElements } from "./timeline";

const elements: TimelineElements = [
  {
    title: "Liebfrauen Schule Köln",
    content: "Ich habe mein Abitur an der Liebfrauen Schule Köln gemacht.",
    date: "2015 - 2018",
  },

  {
    title: "Liebfrauen Schule Köln",
    content: "Ich habe mein Abitur an der Liebfrauen Schule Köln gemacht.",
    date: "2015 - 2018",
  },

  {
    title: "Liebfrauen Schule Köln",
    content: "Ich habe mein Abitur an der Liebfrauen Schule Köln gemacht.",
    date: "2015 - 2018",
  },
];

export const Work: FC = () => {
  return (
    <>
      <H2>Professional Life</H2>
      <Timeline elements={elements} />
    </>
  );
};
