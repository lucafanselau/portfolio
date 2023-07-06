import { FC, ReactNode } from "react";
import { ToolsToolbar } from "./bar";
import { ToolsFocusPanel } from "./focus";
import { ToolsLayout } from "./layout";
import { ToolsSlidePanelHeight } from "./slide";

export const ToolsComposition: FC<{
  children?: ReactNode;
  bar?: ReactNode;
}> = ({ children, bar }) => {
  return (
    <ToolsLayout>
      <div className="flex flex-col justify-between flex-nowrap h-full">
        <div className="!m-0" />
        <ToolsFocusPanel>{children}</ToolsFocusPanel>
        <ToolsToolbar>
          <div className="flex flex-col flex-nowrap max-h-full ">
            <ToolsSlidePanelHeight>{children}</ToolsSlidePanelHeight>
            <div className="p-2 flex justify-between items-center space-x-2 flex-wrap">
              {bar}
            </div>
          </div>
          {/* NOTE: This is not really *inside* of the toolbar, but needs its as a parent, for positioning*/}
          {/*<ToolsSlidePanel>{children}</ToolsSlidePanel>*/}
        </ToolsToolbar>
      </div>
    </ToolsLayout>
  );
};
