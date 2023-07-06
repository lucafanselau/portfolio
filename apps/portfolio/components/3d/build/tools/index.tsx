import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { ToolsComposition } from "@3d/tools";
import { ToolsAction } from "@3d/tools/bar";
import { ToolsPanelContent } from "@3d/tools/content";
import { ProgressItem, ToolsProgress } from "@3d/tools/progress";
import { tools } from "@content/tools";
import { Button } from "@ui/button";
import { shallowEqual } from "fast-equals";
import { FC } from "react";

const BuildProgress: FC = () => {
  return <Button variant="outline">Screenshot</Button>;
};

const content = selectors.pack((store) => {
  const mode = store.ui.mode;
  const key =
    mode.type === "focus" || mode.type === "slide" ? mode.key : undefined;
  // @ts-expect-error
  return key ? tools.explore[key] : undefined;
}, Object.is);

const BuildContent: FC = () => {
  return <div>TODO</div>;
};

const actions = selectors.pack((store) => {
  type ToolContentKeys = keyof (typeof tools)["build"];

  return (Object.keys(tools["build"]) as ToolContentKeys[]).map((key) => {
    return {
      icon: tools["build"][key]?.icon,
      onClick: () => {
        // on destory just start destroy mode
        useStore.getState().updateTools({ type: "slide", key });
      },
    };
  });
});

const BuildActions: FC = () => {
  const items = useStore(...actions);
  return <ToolsAction actions={items} />;
};

export const BuildTools = () => {
  return (
    <ToolsComposition
      bar={
        <>
          <BuildActions />
          <BuildProgress />
        </>
      }
    >
      <BuildContent />
    </ToolsComposition>
  );
};
