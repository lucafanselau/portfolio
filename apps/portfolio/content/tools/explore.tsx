import { Projects } from "@components/about/projects";
import { School } from "@components/about/school";
import { Work } from "@components/about/work";
import { isNone, isSome } from "@components/utils";
import {
  Icon,
  IconArrowsMaximize,
  IconArrowsMove,
  IconBuildingSkyscraper,
  IconClick,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconHandClick,
  IconHandTwoFingers,
  IconHome,
  IconInfoSmall,
  IconMouse,
  IconPointer,
  IconSchool,
} from "@tabler/icons-react";
import { Kbd } from "@ui/kbd";
import { H3, H4, P } from "@ui/typography";
import { FC, ReactNode } from "react";
import { ToolsContent } from "./types";

export const Instruction: FC<{
  Icon: Icon;
  title: ReactNode;
  mobile: ReactNode;
  desktop?: ReactNode;
}> = ({ Icon, title, mobile, desktop }) => (
  <div className="flex flex-1 flex-col items-start space-y-2 border-2 rounded-lg p-2">
    <div className={"flex items-center space-x-2"}>
      <div className={"p-2 border-2 rounded-lg"}>
        <Icon size={16} />
      </div>
      <H4>{title}</H4>
    </div>
    <div className={"flex items-start space-x-2"}>
      <IconDeviceMobile size={20} className={"flex-none"} />
      {isNone(desktop) && (
        <>
          <P>/</P>
          <IconDeviceDesktop size={20} className={"flex-none"} />
        </>
      )}
      <P>:</P>
      <P size={"sm"}>{mobile}</P>
    </div>

    {isSome(desktop) && (
      <div className={"flex items-start space-x-2"}>
        <IconDeviceDesktop size={20} className={"flex-none"} />
        <P>:</P>
        <P size={"sm"}>{desktop}</P>
      </div>
    )}
  </div>
);

const Instructions: FC<{}> = () => {
  return (
    <>
      <H3>Instructions:</H3>
      <div
        className={"mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2"}
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
        <Instruction
          title={"Rotate Camera"}
          Icon={IconArrowsMove}
          mobile={
            <>
              <Kbd className={"mr-2 w-10"}>
                <IconHandClick className={"mx-auto"} size={12} />
              </Kbd>
              +
              <Kbd className={"mx-2 w-10"}>
                <IconArrowsMove className={"mx-auto"} size={12} />
              </Kbd>
              Click and move the finger
            </>
          }
          desktop={
            <>
              <Kbd className={"mr-2 w-10"}>
                <IconClick className={"mx-auto"} size={12} />
              </Kbd>
              +
              <Kbd className={"mx-2 w-10"}>
                <IconArrowsMove className={"mx-auto"} size={12} />
              </Kbd>
              Click and move the cursor
            </>
          }
        />
        <Instruction
          title={"Zoom"}
          Icon={IconArrowsMaximize}
          mobile={
            <>
              <Kbd className={"mr-2 w-10"}>
                <IconHandTwoFingers className={"mx-auto"} size={12} />
              </Kbd>
              Scroll in and out using two fingers
            </>
          }
          desktop={
            <>
              <Kbd className={"mr-2 w-10"}>
                <IconMouse size={14} className={"mx-auto"} />
              </Kbd>
              Scroll in and out to zoom
            </>
          }
        />
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
        Projects are an essential way to learn new projects, some of these
        projects are listed here. I will do my best to keep this list up to
        date.
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
