import { toArray } from "@components/utils";
import { content } from "@content/index";
import { IconBrandGithub } from "@tabler/icons-react";
import { Button } from "@ui/button";
import { Card } from "@ui/card";
import { H2, P } from "@ui/typography";
import Link from "next/link";
import type { FC } from "react";

export const Projects: FC = () => {
  return (
    <>
      <H2>Hobby Projects</H2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {content.projects.map((project) => (
          <Card
            key={project.title}
            className={"flex h-full flex-col justify-between space-y-2"}
          >
            <div>
              <H2>{project.title}</H2>
              <P color="lighter" size="xs">
                {project.subtitle}
              </P>
            </div>
            <P>{project.description}</P>
            <div className="flex flex-wrap justify-end space-x-2">
              {toArray(project.links).map(({ type, link }) => (
                <Button
                  key={"link-" + type}
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
