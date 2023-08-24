import { useStore } from "@3d/store";
import { ToolsAction, ToolsToolbar } from "@3d/tools/bar";
import { ToolsPanelContent } from "@3d/tools/content";
import { ToolsLayout } from "@3d/tools/layout";
import { ToolsProgress } from "@3d/tools/progress";
import { springConfig } from "@3d/tools/slide";
import { content } from "@content/index";
import { tools } from "@content/tools";
import { animated, useSpring } from "@react-spring/web";
import { ScrollArea } from "@ui/scroll-area";
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
      className="card card-padding pointer-events-auto relative z-50 min-h-0"
    >
      <ScrollArea className="h-full">
        <ToolsPanelContent panel={tools.start.info} />
      </ScrollArea>
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
        <div className="min-h-0 flex-1" />
        <StartContent />
        {/* Used to give a window to the small figure */}
        <div className="h-[300px] w-full" />
        <ToolsToolbar className="card-padding flex w-full flex-none flex-wrap items-center justify-between space-x-2">
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
