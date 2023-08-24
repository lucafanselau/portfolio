import type { FC, ReactNode } from "react";
import { ToolsToolbar } from "./bar";
import { ToolsFocusPanel } from "./focus";
import { ToolsLayout } from "./layout";
import { ToolsSlidePanel } from "./slide";

const MeasuredBar = ({
  children,
  bar,
}: {
  children?: ReactNode;
  bar?: ReactNode;
}) => {
  // const [measureRef, { height }] = useMeasure();

  return (
    <ToolsToolbar className="flex max-h-full flex-col flex-nowrap p-0">
      <ToolsSlidePanel>{children}</ToolsSlidePanel>
      <div className="card-padding flex w-full flex-none flex-nowrap items-center justify-between space-x-2">
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
