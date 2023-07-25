import type { AssetCategory, AssetEntry, AssetKey } from "@3d/generated-loader";
import collection from "@3d/generated/collection.json";
import { useStore } from "@3d/store";
import { H2 } from "@ui/typography";
import type { FC } from "react";
import { Fragment } from "react";
import { ToolsItemCard } from "./item-card";

const CreateCard: FC<{
  type: AssetCategory;
  entry: AssetEntry;
}> = ({ type, entry }) => {
  const onClick = () => {
    // default variant
    // lets select a random variant
    const variant = Array.isArray(entry.file)
      ? entry.file[Math.floor(Math.random() * entry.file.length)].id
      : undefined;

    useStore.getState().initBuild({
      type: "build",
      payload: {
        id: entry.id as AssetKey<AssetCategory>,
        type,
        state: {
          rotation: 0,
          valid: true,
          variant,
        },
      },
    });
  };

  return <ToolsItemCard onClick={onClick} entry={entry} />;
};

export const keys = Object.keys(collection) as AssetCategory[];

export const keyLabels = {
  buildings: "Buildings",
  props: "Props",
  streets: "Streets",
} satisfies Record<AssetCategory, string>;

export const CreatePanel = () => {
  return (
    <div className={"flex w-full flex-col gap-4"}>
      {keys.map((key) => (
        <Fragment key={key}>
          <H2>{keyLabels[key]}</H2>
          <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            {(Object.values(collection[key]) as AssetEntry[]).map((entry) => (
              <CreateCard key={entry.id} type={key} entry={entry} />
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  );
};
