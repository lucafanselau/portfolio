import { FC, ReactNode } from "react";
import { ToolsActionButtons, ToolsToolbar } from "./bar";
import { ToolsContent } from "./content";
import { ToolsFocusPanel } from "./focus";
import { ToolsLayout } from "./layout";
import { ToolsOverlay } from "./overlay";
import { ToolsProgress } from "./progress";
import { ToolsSlidePanel, ToolsSlidePanelHeight } from "./slide";

const ToolsComposition: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <ToolsOverlay>
      <ToolsLayout>
        <ToolsToolbar>
          <ToolsSlidePanelHeight>{children}</ToolsSlidePanelHeight>
          <div className="p-2 flex justify-between items-center space-x-2">
            <ToolsActionButtons />
            <ToolsProgress />
          </div>
          {/* NOTE: This is not really *inside* of the toolbar, but needs its as a parent, for positioning*/}
          {/*<ToolsSlidePanel>{children}</ToolsSlidePanel>*/}
        </ToolsToolbar>
        <ToolsFocusPanel>{children}</ToolsFocusPanel>
      </ToolsLayout>
    </ToolsOverlay>
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
