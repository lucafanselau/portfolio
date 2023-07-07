import type { FC, ReactNode } from "react";
import { ToolsOverlay } from "./overlay";

export const ToolsLayout: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <div className="pointer-events-none h-full min-h-0 w-full flex-1  basis-0">
      <ToolsOverlay />
      {children}
    </div>
  );
};
