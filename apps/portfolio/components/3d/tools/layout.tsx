import { FC, ReactNode } from "react";

export const ToolsLayout: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <div className="w-full h-full flex-1 basis-0 min-h-0  pointer-events-none">
      {children}
    </div>
  );
};
