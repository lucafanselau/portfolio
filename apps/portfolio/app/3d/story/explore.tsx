import { transitionToCamera } from "@3d/camera";
import { useStore } from "@3d/store";
import {
  Icon,
  IconArrowsMaximize,
  IconMouse,
  IconPointer,
} from "@tabler/icons-react";
import { Button } from "@ui/button";
import { H1, P } from "@ui/typography";
import { FC } from "react";

const Instruction: FC<{ Icon: Icon; text: string }> = ({ Icon, text }) => (
  <div className="flex flex-col items-center flex-1 space-y-2">
    <Icon />
    <P align={"center"}>{text}</P>
  </div>
);

const prevent = (e: React.MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();
};

export const preventProps = {
  onPointerDown: prevent,
};

const TopLevelButton = () => {
  const onClick = async () => {
    const { setState } = useStore.getState();
    await transitionToCamera("top-level", "origin");
    setState("top-level");
  };

  return (
    <Button
      {...preventProps}
      onClick={onClick}
      className={"px-8 pointer-events-auto"}
    >
      To top level
    </Button>
  );
};

export const ExploreBubbleContent = {
  header: (
    <>
      <H1>
        Let's <span className={"text-animation"}>Explore</span> a bit
      </H1>
      <P color={"lighter"}>
        This world is filled with locations, that are important to me.
      </P>
    </>
  ),
  content: (
    <>
      <div className={"mb-4 flex space-x-2"}>
        <Instruction Icon={IconPointer} text={"Click to move character"} />
        <Instruction Icon={IconMouse} text={"Click and drag to pan around"} />
        <Instruction
          Icon={IconArrowsMaximize}
          text={"Scroll / Pan to zoom in or out"}
        />
      </div>
      <P color={"lighter"} size={"xs"}>
        Pssst, once you explored all the locations, the journey is not over...
      </P>
    </>
  ),
  action: null, // <TopLevelButton />,
};
export const ExploreSchool = {
  header: (
    <>
      <H1>
        Welcome to the <span className={"text-animation"}>School</span>
      </H1>
      <P color={"lighter"}>
        This is where I spent most of my time during my childhood.
      </P>
    </>
  ),
  content: (
    <P>
      You reached the school of this little town. The school is where it all
      started.
      <span className={"text-red-500"}>
        <br />
        TODO TEXT
      </span>
    </P>
  ),
  action: (
    <Button {...preventProps} className={"px-8 pointer-events-auto"}>
      Learn More
    </Button>
  ),
};
