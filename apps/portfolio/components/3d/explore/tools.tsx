import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { ToolsComposition } from "@3d/tools";
import { ToolsAction } from "@3d/tools/bar";
import { ToolsPanelContent } from "@3d/tools/content";
import { ProgressItem, ToolsProgress } from "@3d/tools/progress";
import { tools } from "@content/tools";
import { shallowEqual } from "fast-equals";
import { FC } from "react";

const progress = selectors.pack((store): ProgressItem => {
  const { world } = store;
  const { history } = world.interaction;
  const total = Object.keys(history).length;
  const checked = Object.values(history)
    .map(Number)
    .reduce((a, b) => a + b, 0);

  const finished = checked >= total;

  let extraText = "";
  if (finished) extraText = "Now let's expand the city a bit!";
  else extraText = `You are still *missing ${total - checked} locations*.`;
  return {
    button: "Next",
    target: "build",
    disabled: false, // TODO: !finished,
    extraText,
  };
}, shallowEqual);
const ExploreProgress: FC = () => {
  const item = useStore(...progress);
  return <ToolsProgress item={item} />;
};

const content = selectors.pack((store) => {
  const mode = store.ui.mode;
  const key =
    mode.type === "focus" || mode.type === "slide" ? mode.key : undefined;
  // @ts-expect-error
  return key ? tools.explore[key] : undefined;
}, Object.is);

const ExploreContent: FC = () => {
  const item = useStore(...content);
  return <ToolsPanelContent panel={item} />;
};

const actions = selectors.pack((store) => {
  type ToolContentKeys = keyof (typeof tools)["explore"];
  const disabled = (key: ToolContentKeys) => {
    if (key === "info") return false;
    return store.world.interaction.history[key] !== true;
  };

  return (Object.keys(tools["explore"]) as ToolContentKeys[]).map((key) => {
    return {
      icon: tools["explore"][key]?.icon,
      disabled: disabled(key),
      onClick: () => {
        useStore.getState().updateTools({ type: "slide", key });
      },
    };
  });
});

const ExploreActions: FC = () => {
  const items = useStore(...actions);
  return <ToolsAction actions={items} />;
};

export const ExploreTools = () => {
  return (
    <ToolsComposition
      bar={
        <>
          <ExploreActions />
          <ExploreProgress />
        </>
      }
    >
      <ExploreContent />
    </ToolsComposition>
  );
};
