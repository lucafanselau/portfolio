import { FC, ReactNode } from "react";

export const ToolsLayout: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <div className="container h-full">
      <div className="relative w-full h-full">{children}</div>
    </div>
  );
};
