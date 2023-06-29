import { ComponentType, ReactElement, ReactNode } from "react";

export type ToolsContent = {
  header: [ReactNode, ReactNode | undefined];
  body: ReactNode;
  icon: ReactNode;
};
