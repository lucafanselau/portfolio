import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { FC, ReactNode } from "react";
import { ToolsActionButtons, ToolsToolbar } from "./bar";
import { ToolbarBuildContent } from "./build/bar";
import { ToolsContent } from "./content";
import { ToolsFocusPanel } from "./focus";
import { ToolsLayout } from "./layout";
import { ToolsOverlay } from "./overlay";
import { ToolsProgress } from "./progress";
import { ToolsSlidePanelHeight } from "./slide";

const ToolbarContent: FC = () => {
  const buildMode = useStore(...selectors.ui.open.build);

  if (buildMode) {
    return <ToolbarBuildContent />;
  } else {
    return (
      <div className="p-2 flex justify-between items-center space-x-2 flex-wrap">
        <ToolsActionButtons />
        <ToolsProgress />
      </div>
    );
  }
};

const ToolsComposition: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <ToolsLayout>
      <ToolsOverlay></ToolsOverlay>
      <div className="flex flex-col justify-between flex-nowrap h-full">
        <div className="!m-0" />
        <ToolsFocusPanel>{children}</ToolsFocusPanel>
        <ToolsToolbar>
          <div className="flex flex-col flex-nowrap max-h-full ">
            <ToolsSlidePanelHeight>{children}</ToolsSlidePanelHeight>
            <ToolbarContent />
          </div>
          {/* NOTE: This is not really *inside* of the toolbar, but needs its as a parent, for positioning*/}
          {/*<ToolsSlidePanel>{children}</ToolsSlidePanel>*/}
        </ToolsToolbar>
      </div>
    </ToolsLayout>
  );
};

/**
 * Load the Toolbar components
 * dynamically based on the store
 */
export const Tools = () => {
  return (
    <ToolsComposition>
      <ToolsContent />
    </ToolsComposition>
  );
};
