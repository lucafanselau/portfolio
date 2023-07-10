import { BuildTools } from "@3d/build/tools";
import { ExploreTools } from "@3d/explore/tools";
import { StartTools } from "@3d/start/tools";
import { useStore } from "@3d/store";
import { match } from "ts-pattern";

export const ToolsLoader = () => {
  const ToolsSlot = useStore((s) => {
    return match(s)
      .with({ state: "start" }, () => StartTools)
      .with({ state: "explore" }, () => ExploreTools)
      .with({ state: "build" }, () => BuildTools)
      .exhaustive();
  }, Object.is);
  return <ToolsSlot />;
};
