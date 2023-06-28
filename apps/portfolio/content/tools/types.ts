import { ComponentType, ReactElement, ReactNode } from "react";

export type ToolsContent = {
  header: [ReactNode, ReactNode | undefined];
  body: ReactNode;
};

export type ProgressComponent = ComponentType<{
  onProgress: (value: "start" | "explore" | "build") => void;
}>;
