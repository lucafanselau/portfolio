import { GeneratedKeys } from "@3d/generated-loader";
import collection from "@3d/generated/collection.json";
import { useStore } from "@3d/store";
import { H2 } from "@ui/typography";
import { FC, Fragment } from "react";
import { ToolsItemCard } from "./item-card";

const CreateCard: FC<{
  id: string;
  type: GeneratedKeys;
  entry: (typeof collection)[GeneratedKeys][number];
}> = ({ id, type, entry }) => {
  const onClick = () => {
    useStore.getState().startBuild(type, id);
  };

  return <ToolsItemCard onClick={onClick} entry={entry} />;
};

export const keys = Object.keys(collection) as GeneratedKeys[];

export const keyLabels = {
  buildings: "Buildings",
  props: "Props",
  streets: "Streets",
} satisfies Record<GeneratedKeys, string>;

export const CreatePanel = () => {
  return (
    <div className={"flex flex-col gap-4 w-full"}>
      {keys.map((key) => (
        <Fragment key={key}>
          <H2>{keyLabels[key]}</H2>
          <div className="grid w-full gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {(key === "streets"
              ? [{ ...collection[key][3], name: "Standard Street" }]
              : collection[key]
            ).map((entry) => (
              <CreateCard
                key={entry.id}
                id={entry.id}
                type={key}
                entry={entry}
              />
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  );
};
