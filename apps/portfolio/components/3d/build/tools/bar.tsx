import { findAssetEntry } from "@3d/generated-loader";
import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { ToolsAction } from "@3d/tools/bar";
import { formatters } from "@components/formatters";
import { isNone } from "@components/utils";
import { tools } from "@content/tools";
import { useStore as useThreeStore } from "@react-three/fiber";
import {
  IconBulldozer,
  IconCamera,
  IconChevronLeft,
  IconHammer,
  IconRotateClockwise,
  IconX,
} from "@tabler/icons-react";
import { Button } from "@ui/button";
import { P } from "@ui/typography";
import { deepEqual } from "fast-equals";
import type { FC } from "react";
import { isMatching } from "ts-pattern";
import { mutation } from "../mutation";
import { buildPattern, matchBuild } from "../mutation/build";
// import { buildEntry } from "../types";

const barInfo = selectors.pack(
  (s) =>
    matchBuild(s, {
      build: (b) => {
        const entry = findAssetEntry(b.type, b.id);

        return {
          icon: <IconHammer />,
          rotate: b.type !== "streets",
          text: `Building *${entry?.name}*`,
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

export const BuildActiveBar: FC = ({}) => {
  // const entry = useStore(...buildEntry);
  // if (isNone(entry)) return null;
  const info = useStore(...barInfo);
  if (isNone(info)) return null;

  const { icon, rotate, text } = info;

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
            <div className="w-[2px] h-8 bg-input" />
          </>
        )}
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
  const screenshot = () => {
    const three = useStore.getState().getThree?.();
    if (isNone(three)) return;

    three.gl.domElement.toBlob((blob) => {
      if (isNone(blob)) return;

      const file = new File([blob], "screenshot.png", { type: blob.type });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          files: [file],
          title: "Screenshot",
        });
      } else {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "screenshot.png";
        a.click();
        a.remove();
      }

      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <Button onClick={screenshot} variant="outline" size={"icon"}>
      <IconCamera />
    </Button>
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
