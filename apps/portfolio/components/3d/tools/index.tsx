import { FC, ReactNode } from "react";
import useMeasure from "react-use-measure";
import { ToolsToolbar } from "./bar";
import { ToolsFocusPanel } from "./focus";
import { ToolsLayout } from "./layout";
import { ToolsSlidePanelHeight } from "./slide";

const MeasuredBar = ({
  children,
  bar,
}: {
  children?: ReactNode;
  bar?: ReactNode;
}) => {
  const [measureRef, { height }] = useMeasure();

  return (
    <ToolsToolbar
      className="flex flex-col flex-nowrap max-h-full"
      minHeight={height + 4}
    >
      <ToolsSlidePanelHeight>{children}</ToolsSlidePanelHeight>
      <div
        className="p-2 flex-none flex justify-between items-center space-x-2 flex-wrap"
        ref={measureRef}
      >
        {bar}
      </div>
      {/* NOTE: This is not really *inside* of the toolbar, but needs its as a parent, for positioning*/}
      {/*<ToolsSlidePanel>{children}</ToolsSlidePanel>*/}
    </ToolsToolbar>
  );
};

export const ToolsComposition: FC<{
  children?: ReactNode;
  bar?: ReactNode;
}> = ({ children, bar }) => {
  return (
    <ToolsLayout>
      <div className="flex flex-col justify-between flex-nowrap h-full">
        <div className="!m-0" />
        <ToolsFocusPanel>{children}</ToolsFocusPanel>
        <MeasuredBar bar={bar}>{children}</MeasuredBar>
      </div>
    </ToolsLayout>
  );
};
