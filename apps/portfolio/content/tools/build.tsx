import { IconInfoSmall } from "@tabler/icons-react";
import { ToolsContent } from "./types";

export const info = {
  header: [
    <>
      Wow you are still here. Let's{" "}
      <span className={"text-animation"}>build</span> something together.
    </>,
    "I love city builder games, so here is one I made.",
  ],
  body: <>NOTHING HERE YET</>,
  icon: <IconInfoSmall />,
} satisfies ToolsContent;

export const build = {
  info,
};
