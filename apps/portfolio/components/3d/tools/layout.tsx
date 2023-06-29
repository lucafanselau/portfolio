import { FC, ReactNode } from "react";

export const ToolsLayout: FC<{ children?: ReactNode }> = ({ children }) => {
	return <div className="w-full h-full">{children}</div>;
};
