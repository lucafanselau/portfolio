import { toArray } from "@components/utils";
import { content } from "@content/index";
import { Card } from "@ui/card";
import { H2, P } from "@ui/typography";
import type { FC } from "react";

export const Projects: FC = () => {
  return (
    <>
      <H2>Hobby Projects</H2>
      <div className="grid grid-cols-3 gap-4">
        {content.projects.map((project) => (
          <Card key={project.title}>
            <H2>{project.title}</H2>
            <P>{project.subtitle}</P>
            <a href={toArray(project.links).map((l) => l.link)[0]}>Link</a>
          </Card>
        ))}
      </div>
    </>
  );
};
