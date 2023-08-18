import { useStore } from "@3d/store";
import { ToolsComposition } from "@3d/tools";
import { ToolsAction, ToolsToolbar } from "@3d/tools/bar";
import { ToolsPanelContent } from "@3d/tools/content";
import { ToolsLayout } from "@3d/tools/layout";
import { ToolsProgress } from "@3d/tools/progress";
import { springConfig } from "@3d/tools/slide";
import { content } from "@content/index";
import { tools } from "@content/tools";
import { animated, useSpring } from "@react-spring/web";
import type { FC } from "react";

const StartContent: FC = () => {
  const transition = useStore((s) => s.ui.transition);

  const spring = useSpring({
    from: { opacity: 0, transform: "scale(100%)" },
    to: {
      opacity: !transition ? 1 : 0,
      transform: !transition ? "scale(100%)" : "scale(0%)",
    },
    config: springConfig,
  });

  return (
    <animated.div
      style={spring}
      className="relative z-50 card card-padding flex-1 min-h-0"
    >
      <ToolsPanelContent panel={tools.start.info} />
    </animated.div>
  );
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
  const transition = useStore((s) => s.ui.transition);
  return (
    <ToolsLayout>
      <div className="flex h-full flex-col flex-nowrap justify-between">
        <StartContent />
        {/* Used to give a window to the small figure */}
        <div className="w-full h-[300px]" />
        <ToolsToolbar className="flex w-full flex-none flex-wrap items-center justify-between space-x-2 card-padding">
          <ToolsAction actions={actions} />
          <ToolsProgress
            item={{
              button: "Let's go!",
              disabled: transition,
              target: "explore",
            }}
          />
        </ToolsToolbar>
      </div>
    </ToolsLayout>
  );
};
