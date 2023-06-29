import { ReactNode } from "react";
import { FC } from "react";

export const ToolsOverlay: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <div className="absolute inset-0 bg-background/90 pointer-events-none">
      {children}
    </div>
  );
};
