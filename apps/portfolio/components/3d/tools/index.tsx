import { FC, ReactNode } from "react";
import { InfoButton, ToolsToolbar } from "./bar";
import { ToolsContent } from "./content";
import { ToolsFocusPanel } from "./focus";
import { ToolsLayout } from "./layout";
import { ToolsOverlay } from "./overlay";
import { ToolsProgress } from "./progress";
import { ToolsSlidePanel } from "./slide";

const ToolsComposition: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <ToolsOverlay>
      <ToolsLayout>
        <ToolsToolbar>
          <InfoButton />
					<ToolsProgress />
          {/* NOTE: This is not really *inside* of the toolbar, but needs its as a parent, for positioning*/}
          <ToolsSlidePanel>{children}</ToolsSlidePanel>
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
