import { ToolsComposition } from "@3d/tools";
import { ToolsAction } from "@3d/tools/bar";
import { ToolsPanelContent } from "@3d/tools/content";
import { ToolsProgress } from "@3d/tools/progress";
import { content } from "@content/index";
import { tools } from "@content/tools";
import type { FC } from "react";

const StartContent: FC = () => {
  return <ToolsPanelContent panel={tools.start.info} />;
};

const actions = content.config.socials.map((social) => {
  const Icon = social.icon;
  return {
    icon: <Icon />,
    onClick: () => {
      window.open(social.url, "_blank");
    },
  };
});

export const StartTools = () => {
  return (
    <ToolsComposition
      bar={
        <>
          <ToolsAction actions={actions} />
          <ToolsProgress
            item={{
              button: "Let's go!",
              target: "explore",
            }}
          />
        </>
      }
    >
      <StartContent />
    </ToolsComposition>
  );
};
