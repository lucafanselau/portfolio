import collection from "@3d/generated/collection.json";
import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { formatters } from "@components/formatters";
import { isNone } from "@components/utils";
import { IconBulldozer, IconHammer } from "@tabler/icons-react";
import { Button } from "@ui/button";
import { P } from "@ui/typography";
import { FC } from "react";
import { match, P as __ } from "ts-pattern";

export const ToolbarBuildContent: FC<{}> = ({}) => {
  const build = useStore(...selectors.ui.build);

  if (isNone(build)) return null;

  const text = match(build)
    .with(
      { type: "build", key: { type: "streets" } },
      () => "Building *Standard Street*"
    )
    .with(
      { type: "build", key: { type: __.union("buildings", "props") } },
      ({ key: { id, type } }) =>
        `Building *${
          collection[type].find((el) => el.id === id)?.name ?? "Unknown"
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
        variant="destructive"
        size="sm"
        className="px-8 pointer-events-auto"
      >
        Cancel
      </Button>
    </div>
  );
};
