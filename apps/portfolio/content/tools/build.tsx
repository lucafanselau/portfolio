import {
  IconArrowsMaximize,
  IconBulldozer,
  IconChevronLeft,
  IconClick,
  IconCrane,
  IconHammer,
  IconInfoSmall,
  IconMouse,
  IconRotateClockwise,
} from "@tabler/icons-react";
import { Kbd } from "@ui/kbd";
import { P } from "@ui/typography";
import {
  InstructionCameraPan,
  InstructionCameraRotate,
  InstructionCameraZoom,
} from "./instructions";
import { ToolsContent } from "./types";

const Instructions = () => {
  return (
    <div
      className={"mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2"}
    >
      <InstructionCameraPan />
      <InstructionCameraRotate />
      <InstructionCameraZoom />
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
      <P>
        The world is yours, you can build whatever you want. Just use the tools
        in the toolbar to access the build or destroy mode.
      </P>
      <P>
        I have unlocked the camera, so that you can freely move around. You can
        now:
      </P>
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
    "Just click on a card and the build mode will open and you can freely place the structure on the map.",
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

export const tutorial = {
  build: {
    header: [
      <>
        How to <span className={"text-animation"}>Build</span>.
      </>,
      "Placing buildings is easy",
    ],
    body: (
      <>
        <P>
          You will see the selected building as a preview on the map. You can
          move the preview around the screen by touching{" "}
          <Kbd className={"mr-2 w-10"}>
            <IconClick className={"mx-auto"} size={12} />
          </Kbd>
          the screen in the desired location.
        </P>

        <P>
          Once you are happy with the location, use the building button{" "}
          <Kbd className={"mr-2 w-10"}>
            <IconHammer className={"mx-auto"} size={12} />
          </Kbd>
          in the toolbar to confirm the placement. You can also use the{" "}
          <Kbd>Enter</Kbd> key to confirm. You can place multiple instances of
          the same object in one go, by choosing a new location and confirming
          again.
        </P>

        <P>
          Once you are done building, you can use the back button{" "}
          <Kbd className={"mr-2 w-10"}>
            <IconChevronLeft className={"mx-auto"} size={12} />
          </Kbd>
          or the <Kbd>Escape</Kbd> key to exit build mode.
        </P>

        <P>
          If applicable you can rotate the building by using the <Kbd>Q</Kbd>{" "}
          and <Kbd>E</Kbd> keys, or by using the designated buttons{" "}
          <Kbd className={"mr-2 w-10"}>
            <IconRotateClockwise
              className={"mx-auto -scale-x-100 -scale-y-100"}
              size={10}
            />
          </Kbd>{" "}
          and{" "}
          <Kbd className={"mr-2 w-10"}>
            <IconRotateClockwise className={"mx-auto -scale-y-100"} size={10} />
          </Kbd>
          in the toolbar.
        </P>

        <P>
          During build the color of the preview will change to indicate if
          placement is valid. <strong>green</strong> means valid,{" "}
          <strong>red</strong> means invalid. You can only confirm the building
          process if the preview base is green.
        </P>
      </>
    ),
    icon: <IconCrane />,
  } satisfies ToolsContent,

  destroy: {
    header: [
      <>
        How to <span className={"text-animation"}>Destroy</span>.
      </>,
      "Removing buildings is easy",
    ],
    body: (
      <>
        <P>
          Just select the buildings that you want to remove. The currently
          selected will have a glowing outline. To confirm your selection just
          use the{" "}
          <Kbd className={"mr-2 w-10"}>
            <IconBulldozer className={"mx-auto"} size={12} />
          </Kbd>{" "}
          button in the toolbar. You can also use the <Kbd>Enter</Kbd> key to
          confirm.
        </P>
        <P>
          Once you are done destroying, you can use the back button{" "}
          <Kbd className={"mr-2 w-10"}>
            <IconChevronLeft className={"mx-auto"} size={12} />
          </Kbd>
          or the <Kbd>Escape</Kbd> key to exit build mode.
        </P>
      </>
    ),
    icon: <IconBulldozer />,
  } satisfies ToolsContent,
};

export const build = {
  info,
  create,
  destroy,
};
