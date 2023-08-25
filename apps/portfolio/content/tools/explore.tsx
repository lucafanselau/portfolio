import { Projects } from "@components/about/projects";
import { School } from "@components/about/school";
import { Work } from "@components/about/work";
import {
  IconBuildingSkyscraper,
  IconHandClick,
  IconHome,
  IconInfoSmall,
  IconPointer,
  IconSchool,
} from "@tabler/icons-react";
import { Kbd } from "@ui/kbd";
import { H3, P } from "@ui/typography";
import { FC } from "react";
import {
  Instruction,
  InstructionCameraRotate,
  InstructionCameraZoom,
} from "./instructions";
import { ToolsContent } from "./types";

const Instructions: FC<{}> = () => {
  return (
    <>
      <H3>Instructions:</H3>
      <div
        className={"mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3"}
      >
        <Instruction
          Icon={IconPointer}
          title={"Move around"}
          mobile={
            <>
              <Kbd className={"mr-2 w-10"}>
                <IconHandClick className={"mx-auto"} size={12} />
              </Kbd>
              Click where you want me to go
            </>
          }
        />

        <InstructionCameraRotate />
        <InstructionCameraZoom />
      </div>
    </>
  );
};

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
        You can freely move around in this world now. Some of the locations
        carry information about me, my life and my work. Make yourself
        comfortable and explore the world.
      </P>

      <Instructions />
      <P size={"xs"}>
        You can visit the locations in the town, by walking up to their
        entrance. Pssst, once you explored all the locations, the journey is not
        over...
      </P>
      <P size={"xs"}>
        If you want to see this panel again you can click on the{" "}
        <IconInfoSmall className={"inline-block"} size={16} /> icon in the
        toolbar on the bottom of the screen.
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
  body: (
    <>
      <P>
        Projects are an essential part to learning new things. Here are some of
        the projects I have worked on:
      </P>
      <Projects />
    </>
  ),
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
      <P>
        Would you like to know more about my professional career? Here is a
        quick overview:
      </P>
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
