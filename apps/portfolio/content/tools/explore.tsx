import { FC } from "react";
import { ToolsContent } from "./types";
import { P } from "@ui/typography";
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
import { School } from "@components/about/school";
import { Work } from "@components/about/work";

const Instruction: FC<{ Icon: Icon; text: string }> = ({ Icon, text }) => (
  <div className="flex flex-col items-center flex-1 space-y-2">
    <Icon />
    <P align={"center"}>{text}</P>
  </div>
);

const info = {
  header: [
    <>
      Let's <span className={"text-animation"}>Explore</span> a bit
    </>,
    "This world is filled with locations, that are important to me.",
  ],
  body: (
    <>
      <div className={"mb-4 flex space-x-2"}>
        <Instruction Icon={IconPointer} text={"Click to move character"} />
        <Instruction Icon={IconMouse} text={"Click and drag to pan around"} />
        <Instruction
          Icon={IconArrowsMaximize}
          text={"Scroll / Pan to zoom in or out"}
        />
      </div>
      <P color={"lighter"} size={"sm"}>
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
