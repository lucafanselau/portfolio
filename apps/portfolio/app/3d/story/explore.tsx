import {
  IconPointer,
  Icon,
  IconMouse,
  IconArrowsMaximize,
} from "@tabler/icons-react";
import { H1, P } from "@ui/typography";
import { FC, ReactNode } from "react";

const Instruction: FC<{ Icon: Icon; text: string }> = ({ Icon, text }) => (
  <div className="flex flex-col items-center flex-1 space-y-2">
    <Icon />
    <P align={"center"}>{text}</P>
  </div>
);

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
      <div className={"flex space-x-2"}>
        <Instruction Icon={IconPointer} text={"Click to move character"} />
        <Instruction Icon={IconMouse} text={"Click and drag to pan around"} />
        <Instruction
          Icon={IconArrowsMaximize}
          text={"Scroll / Pan to zoom in or out"}
        />
      </div>
    </>
  ),
  action: null,
};
