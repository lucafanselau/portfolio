import { toArray } from "@components/utils";
import { content } from "@content/index";
import {
  IconBrandGithub,
  IconInnerShadowLeftFilled,
} from "@tabler/icons-react";
import { Button } from "@ui/button";
import { Card } from "@ui/card";
import { H2, P } from "@ui/typography";
import Link from "next/link";
import type { FC } from "react";

export const Projects: FC = () => {
  return (
    <>
      <H2>Hobby Projects</H2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {content.projects.map((project) => (
          <Card
            key={project.title}
            className={"justify-between flex flex-col h-full space-y-2"}
          >
            <div>
              <H2>{project.title}</H2>
              <P color="lighter" size="xs">
                {project.subtitle}
              </P>
            </div>
            <P>{project.description}</P>
            <div className="flex flex-wrap space-x-2 justify-end">
              {toArray(project.links).map(({ type, link }) => (
                <Button
                  asChild
                  size={type === "github" ? "icon" : "sm"}
                  variant={type === "github" ? "outline" : "inverted"}
                >
                  <Link href={link}>
                    {type === "github" ? <IconBrandGithub /> : "Show me more!"}
                  </Link>
                </Button>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};
