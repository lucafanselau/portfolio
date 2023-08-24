import { isNone, isSome } from "@components/utils";
import {
  Icon,
  IconArrowsDiagonal,
  IconArrowsMaximize,
  IconArrowsMove,
  IconArrowsMoveVertical,
  IconClick,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconHandClick,
  IconHandTwoFingers,
  IconMouse,
} from "@tabler/icons-react";
import { Kbd } from "@ui/kbd";
import { H4, P } from "@ui/typography";
import { FC, ReactNode } from "react";

export const Instruction: FC<{
  Icon: Icon;
  title: ReactNode;
  mobile: ReactNode;
  desktop?: ReactNode;
}> = ({ Icon, title, mobile, desktop }) => (
  <div className="flex flex-1 flex-col items-start space-y-2 rounded-lg border-2 p-2">
    <div className={"flex items-center space-x-2"}>
      <div className={"rounded-lg border-2 p-2"}>
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

export const InstructionCameraRotate = () => {
  return (
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
  );
};

export const InstructionCameraZoom = () => {
  return (
    <Instruction
      title={"Zoom"}
      Icon={IconArrowsMaximize}
      mobile={
        <>
          <Kbd className={"mr-2 w-10"}>
            <IconHandTwoFingers className={"mx-auto"} size={12} />
          </Kbd>
          +
          <Kbd className={"mx-2 w-10"}>
            <IconArrowsDiagonal className={"mx-auto"} size={12} />
          </Kbd>
          Pinch using two fingers
        </>
      }
      desktop={
        <>
          <Kbd className={"mr-2 w-10"}>
            <IconMouse size={14} className={"mx-auto"} />
          </Kbd>
          +
          <Kbd className={"mx-2 w-10"}>
            <IconArrowsMoveVertical className={"mx-auto"} size={12} />
          </Kbd>
          Scroll in and out to zoom
        </>
      }
    />
  );
};

export const InstructionCameraPan = () => {
  return (
    <Instruction
      title={"Move Camera"}
      Icon={IconArrowsMaximize}
      mobile={
        <>
          <Kbd className={"mr-2 w-10"}>
            <IconHandTwoFingers className={"mx-auto"} size={12} />
          </Kbd>
          +
          <Kbd className={"mx-2 w-10"}>
            <IconArrowsMove className={"mx-auto"} size={12} />
          </Kbd>
          Touch the screen with two fingers and move them in parallel
        </>
      }
      desktop={
        <>
          <Kbd className={"mr-2 w-10"}>Shift</Kbd>+
          <Kbd className={"mx-2 w-10"}>
            <IconClick className={"mx-auto"} size={12} />
          </Kbd>
          +
          <Kbd className={"mx-2 w-10"}>
            <IconArrowsMove className={"mx-auto"} size={12} />
          </Kbd>
          Click while holding shift and move the cursor
        </>
      }
    />
  );
};
