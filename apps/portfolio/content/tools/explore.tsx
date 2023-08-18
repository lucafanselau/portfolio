import { School } from "@components/about/school";
import { Work } from "@components/about/work";
import {
  Icon,
  IconArrowsMaximize,
  IconBuildingSkyscraper,
  IconHome,
  IconInfoSmall,
  IconMouse,
  IconPointer,
  IconSchool,
} from "@tabler/icons-react";
import { P } from "@ui/typography";
import { FC } from "react";
import { ToolsContent } from "./types";

const Instruction: FC<{ Icon: Icon; text: string }> = ({ Icon, text }) => (
  <div className="flex flex-1 flex-col items-center space-y-2 max-w-[196px]">
    <Icon />
    <P align={"center"}>{text}</P>
  </div>
);

/*

        <Instruction Icon={IconMouse} text={"Click and drag to pan around"} />

 */

const info = {
  header: [
    <>
      Let's <span className={"text-animation"}>Explore</span> a bit
    </>,
    "This world is filled with locations, that are important to me. Explore them all and become the mayor of this town.",
  ],
  body: (
    <>
      <P>
        You can freely move around in this world. Some of the locations carry
        information about me, my life and my work. Make yourself comfortable and
        explore the world.
      </P>
      <div className={"mb-4 flex space-x-2 justify-center"}>
        <Instruction
          Icon={IconPointer}
          text={"Click to move character around"}
        />
        <Instruction
          Icon={IconArrowsMaximize}
          text={"Scroll / Pan with two fingers to zoom in or out"}
        />
      </div>
      <P size={"xs"}>
        You can visit the locations in the town, by walking up to their
        entrance. Pssst, once you explored all the locations, the journey is not
        over...
      </P>
    </>
  ),
  icon: <IconInfoSmall />,
} satisfies ToolsContent;

const school = {
  header: [
    <>
      {" "}
      Welcome to the <span className={"text-animation"}>School</span>
    </>,
    "This is where I spent most of my time during my childhood.",
  ],
  body: (
    <>
      <P>Here is a quick overview of my academic accomplishments:</P>
      <School />
    </>
  ),
  icon: <IconSchool />,
} satisfies ToolsContent;

const home = {
  header: [
    <>
      Nice of you to visit me at <span className={"text-animation"}>Home</span>
    </>,
    "Since learning programming I have worked on many hobby projects, let's look at some of them",
  ],
  body: "NOTHING HERE",
  icon: <IconHome />,
} satisfies ToolsContent;

const office = {
  header: [
    <>
      The very modern <span className={"text-animation"}>Office</span> of this
      town
    </>,
    "This place represents all of the professional steps I took in my life.",
  ],
  body: (
    <>
      <P>Here is a quick overview of my professional career so far</P>
      <Work />
    </>
  ),
  icon: <IconBuildingSkyscraper />,
} satisfies ToolsContent;

export const explore = {
  info,
  school,
  home,
  office,
};
