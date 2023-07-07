import type { FC, ReactNode } from "react";
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
      className="flex max-h-full flex-col flex-nowrap"
      minHeight={height + 4}
    >
      <ToolsSlidePanelHeight>{children}</ToolsSlidePanelHeight>
      <div
        className="flex w-full flex-none flex-wrap items-center justify-between space-x-2 p-2"
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
      <div className="flex h-full flex-col flex-nowrap justify-between">
        <div className="!m-0" />
        <ToolsFocusPanel>{children}</ToolsFocusPanel>
        <MeasuredBar bar={bar}>{children}</MeasuredBar>
      </div>
    </ToolsLayout>
  );
};
