import { findAssetEntry } from "@3d/generated-loader";
import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { ToolsAction } from "@3d/tools/bar";
import { formatters } from "@components/formatters";
import { isNone } from "@components/utils";
import { tools } from "@content/tools";
import {
  IconBulldozer,
  IconChevronLeft,
  IconDeviceFloppy,
  IconHammer,
  IconInfoSmall,
  IconRotateClockwise,
} from "@tabler/icons-react";
import { Button } from "@ui/button";
import { P } from "@ui/typography";
import { deepEqual } from "fast-equals";
import { FC, useCallback } from "react";
import { mutation } from "../mutation";
import { matchBuild } from "../mutation/build";
import { ScreenshotModal } from "./screenshot-modal";
// import { buildEntry } from "../types";

const barInfo = selectors.pack(
  (s) =>
    matchBuild(s, {
      build: (b) => {
        const entry = findAssetEntry(b.type, b.id);

        return {
          icon: <IconHammer />,
          rotate: b.type !== "streets",
          text: `Building *${entry.name}*`,
        };
      },
      destroy: () => ({
        icon: <IconBulldozer />,
        rotate: false,
        text: "Destroying",
      }),
    }),
  deepEqual
);
const dismiss = () => {
  useStore.getState().updateTools({ type: "dismiss" });
};

const info = () => {
  useStore.getState().updateTools({ type: "info" });
};

export const BuildActiveBar: FC = ({}) => {
  // const entry = useStore(...buildEntry);
  // if (isNone(entry)) return null;
  const bar = useStore(...barInfo);
  if (isNone(bar)) return null;

  const { icon, rotate, text } = bar;

  return (
    <>
      <div className="pointer-events-auto flex items-center space-x-2">
        <Button onClick={dismiss} variant="outline" size="icon">
          <IconChevronLeft />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <P>{formatters.bold(text)}</P>
      </div>

      <div className="pointer-events-auto flex items-center space-x-2">
        {rotate && (
          <>
            <Button
              onClick={() => mutation.events.other.rotate("CCW")}
              variant="outline"
              size="icon"
            >
              <IconRotateClockwise className={"-scale-y-100"} />
            </Button>
            <Button
              onClick={() => mutation.events.other.rotate("CW")}
              variant="outline"
              size="icon"
            >
              <IconRotateClockwise className="-scale-x-100 -scale-y-100" />
            </Button>
            <div className="h-8 w-[2px] bg-input" />
          </>
        )}
        <Button onClick={info} variant="outline" size="icon">
          <IconInfoSmall />
        </Button>
        <Button onClick={mutation.build} variant="outline" size="icon">
          {icon}
        </Button>
      </div>
    </>
  );
};

const actions = selectors.pack((store) => {
  type ToolContentKeys = keyof (typeof tools)["build"];

  return (Object.keys(tools.build) as ToolContentKeys[]).map((key) => {
    return {
      icon: tools.build[key].icon,
      onClick: () => {
        // NOTE: on destory just start destroy mode
        if (key === "destroy") mutation.events.init.destroy();
        else useStore.getState().updateTools({ type: "slide", key });
      },
    };
  });
});

const BuildActions: FC = () => {
  const items = useStore(...actions);
  return <ToolsAction actions={items} />;
};

const BuildProgress: FC = () => {
  const save = useCallback(() => {
    const { exportState } = useStore.getState();
    localStorage.setItem("export", JSON.stringify(exportState()));
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <Button onClick={save} variant="outline" size="icon">
        <IconDeviceFloppy />
      </Button>
      <ScreenshotModal />
    </div>
  );
};

export const BuildBar = () => {
  const build = useStore(...selectors.ui.open.build);

  if (build) return <BuildActiveBar />;
  else
    return (
      <>
        <BuildActions />
        <BuildProgress />
      </>
    );
};
