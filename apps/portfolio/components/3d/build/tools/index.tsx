import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { ToolsComposition } from "@3d/tools";
import { ToolsPanelContent } from "@3d/tools/content";
import { useRetained } from "@components/hooks/use-retained";
import { isNone } from "@components/utils";
import { tools } from "@content/tools";
import { tutorial } from "@content/tools/build";
import type { ToolsContent } from "@content/tools/types";
import type { FC } from "react";
import { BuildBar } from "./bar";
import { CreatePanel } from "./create";

const content = selectors.pack((store): ToolsContent | undefined => {
  const mode = store.ui.mode;

  if (mode.type === "build") {
    if (mode.payload.info !== false) {
      return tutorial[mode.payload.type];
    } else {
      return undefined;
    }
  }

  const key =
    mode.type === "focus" || mode.type === "slide" ? mode.key : undefined;
  return key
    ? key === "create"
      ? { ...tools.build[key], body: <CreatePanel /> }
      : // @ts-expect-error (could be any key)
        tools.build[key]
    : undefined;
}, Object.is);

const BuildContent: FC = () => {
  const item = useStore(...content);
  const retained = useRetained(item);
  if (isNone(item)) return null;
  return <ToolsPanelContent panel={item} />;
};

export const BuildTools = () => {
  return (
    <ToolsComposition bar={<BuildBar />}>
      <BuildContent />
    </ToolsComposition>
  );
};
