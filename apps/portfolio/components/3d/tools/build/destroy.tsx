import { GeneratedKeys } from "@3d/generated-loader";
import collection from "@3d/generated/collection.json";
import { useStore } from "@3d/store";
import { FC } from "react";
import { keyLabels, keys } from "./create";
import { ToolsItemCard } from "./item-card";

const DestroyCard: FC<{
  entry: (typeof collection)[GeneratedKeys][number];
}> = ({ entry }) => {
  const onClick = () => {
    useStore.getState().startDestroy();
  };

  return <ToolsItemCard onClick={onClick} entry={entry} />;
};

export const DestroyPanel = () => {
  return (
    <div className="grid w-full gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {keys.map((key) => (
        <DestroyCard
          key={key}
          entry={{ ...collection[key][0], name: keyLabels[key] }}
        />
      ))}
    </div>
  );
};
