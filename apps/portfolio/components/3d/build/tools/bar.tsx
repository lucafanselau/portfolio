import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { ToolsAction } from "@3d/tools/bar";
import { formatters } from "@components/formatters";
import { tools } from "@content/tools";
import { IconBulldozer, IconHammer, IconX } from "@tabler/icons-react";
import { Button } from "@ui/button";
import { P } from "@ui/typography";
import type { FC } from "react";
import { mutation } from "../mutation";
import { isMatching } from "ts-pattern";
import { buildPattern } from "../mutation/build";
// import { buildEntry } from "../types";

export const BuildActiveBar: FC = ({}) => {
  // const entry = useStore(...buildEntry);
  // if (isNone(entry)) return null;

  const isBuild = useStore((s) => isMatching(buildPattern("build"), s));

  const text = isBuild ? `Building *${undefined ?? "Unknown"}*` : "Destroying";

  const dismiss = () => {
    useStore.getState().updateTools({ type: "dismiss" });
  };

  const build = () => {
    mutation.build();
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <P>{formatters.bold(text)}</P>
      </div>

      <div className="flex items-center space-x-2 pointer-events-auto">
        <Button onClick={dismiss} variant="outline" size="icon">
          <IconX />
        </Button>
        <Button onClick={build} variant="outline" size="icon">
          {isBuild ? <IconHammer /> : <IconBulldozer />}
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
  return <Button variant="outline">Screenshot</Button>;
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
