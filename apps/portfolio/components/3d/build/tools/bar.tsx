import collection from "@3d/generated/collection.json";
import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { formatters } from "@components/formatters";
import { isNone } from "@components/utils";
import { tools } from "@content/tools";
import { IconBulldozer, IconHammer } from "@tabler/icons-react";
import { Button } from "@ui/button";
import { P } from "@ui/typography";
import { FC } from "react";
import { match, P as __ } from "ts-pattern";

export const BuildActiveBar: FC<{}> = ({}) => {
  const build = useStore(...selectors.ui.build);

  if (isNone(build)) return null;

  const text = match(build)
    .with(
      { type: "build", payload: { type: "streets" } },
      () => "Building *Standard Street*"
    )
    .with(
      { type: "build", payload: { type: "buildings" } },
      ({ payload: { building, type } }) =>
        `Building *${
          collection.buildings.find((el) => el.id === building)?.name ??
          "Unknown"
        }*`
    )
    .with(
      { type: "build", payload: { type: "props" } },
      ({ payload: { prop, type } }) =>
        `Building *${
          collection.props.find((el) => el.id === props)?.name ?? "Unknown"
        }*`
    )
    .with({ type: "destroy" }, () => "Bulldozing")
    .exhaustive();

  const onClick = () => {
    useStore.getState().updateTools({ type: "dismiss" });
  };

  return (
    <div className="p-2 flex justify-between items-center space-x-2">
      <div className="flex items-center space-x-2">
        {build.type === "build" ? <IconHammer /> : <IconBulldozer />}
        <P>{formatters.bold(text)}</P>
      </div>
      <Button
        onClick={onClick}
        variant="outline"
        size="sm"
        className="px-8 pointer-events-auto"
      >
        Finish
      </Button>
    </div>
  );
};

const actions = selectors.pack((store) => {
  type ToolContentKeys = keyof (typeof tools)["build"];

  return (Object.keys(tools["build"]) as ToolContentKeys[]).map((key) => {
    return {
      icon: tools["build"][key]?.icon,
      onClick: () => {
        // TODO: on destory just start destroy mode
        useStore.getState().updateTools({ type: "slide", key });
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
