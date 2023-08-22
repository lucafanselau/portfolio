import {
  IconArrowsMaximize,
  IconBulldozer,
  IconCrane,
  IconInfoSmall,
  IconMouse,
} from "@tabler/icons-react";
import { Instruction } from "./explore";
import { ToolsContent } from "./types";

const Instructions = () => {
  return (
    <div className={"mb-4 flex space-x-2 justify-center"}>
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

      <Instruction
        Icon={IconArrowsMaximize}
        mobile={"Scroll / Pan with two fingers to zoom in or out"}
      />
      <Instruction
        Icon={IconMouse}
        mobile={
          "Use two fingers and move the focus point of the camera / On Desktop use the Shift+Click"
        }
      />
    </div>
  );
};

export const info = {
  header: [
    <>
      Wow you are still here. Let's{" "}
      <span className={"text-animation"}>build</span> something together.
    </>,
    "I love city builder games, so here is one I made.",
  ],
  body: (
    <>
      I have unlocked the camera, so that you can freely move around. You can
      now:
      <Instructions />
    </>
  ),
  icon: <IconInfoSmall />,
} satisfies ToolsContent;

const create = {
  header: [
    <>
      Build new <span className={"text-animation"}>Structures</span>.
    </>,
    "Just click on a card and the build mode will open. Then the camera will be locked and you can freely place the structure on the map.",
  ],
  body: null,
  icon: <IconCrane />,
} satisfies ToolsContent;

const destroy = {
  header: [
    <>
      Remove <span className={"text-animation"}>Structures</span>.
    </>,
    "Click on a structure and it will be removed from the map.",
  ],
  body: null,
  icon: <IconBulldozer />,
} satisfies ToolsContent;

export const build = {
  info,
  create,
  destroy,
};
