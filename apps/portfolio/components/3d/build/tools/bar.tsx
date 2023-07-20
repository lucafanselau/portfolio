import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { ToolsAction } from "@3d/tools/bar";
import { formatters } from "@components/formatters";
import { tools } from "@content/tools";
import { IconBulldozer, IconHammer } from "@tabler/icons-react";
import { Button } from "@ui/button";
import { P } from "@ui/typography";
import type { FC } from "react";
// import { buildEntry } from "../types";

export const BuildActiveBar: FC = ({}) => {
  // const entry = useStore(...buildEntry);
  // if (isNone(entry)) return null;

  const text = `Building *${undefined ?? "Unknown"}*`;

  const onClick = () => {
    useStore.getState().updateTools({ type: "dismiss" });
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        {true ? <IconHammer /> : <IconBulldozer />}
        <P>{formatters.bold(text)}</P>
      </div>
      <Button
        onClick={onClick}
        variant="outline"
        size="sm"
        className="pointer-events-auto px-8"
      >
        Finish
      </Button>
    </>
  );
};

const actions = selectors.pack((store) => {
  type ToolContentKeys = keyof (typeof tools)["build"];

  return (Object.keys(tools.build) as ToolContentKeys[]).map((key) => {
    return {
      icon: tools.build[key].icon,
      onClick: () => {
        if (key === "destroy") useStore.getState().startDestroy();
        // TODO: on destory just start destroy mode
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
