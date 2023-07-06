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
import { BuildBar } from "./bar";

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

export const BuildTools = () => {
  return (
    <ToolsComposition bar={<BuildBar />}>
      <BuildContent />
    </ToolsComposition>
  );
};
