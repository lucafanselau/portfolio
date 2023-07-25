import { Button } from "@ui/button";
import { cn } from "@ui/utils";
import type { FC, ReactNode } from "react";

export const ToolsToolbar: FC<{
  children?: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  //  const open = useStore(...selectors.ui.open.focus);

  return (
    <div
      className={cn(
        "relative flex w-full basis-auto flex-col justify-end z-50"
      )}
    >
      <div className={cn("card pointer-events-auto p-0", className)}>
        {children}
      </div>
    </div>
  );
};

export const ToolsAction: FC<{
  actions: {
    icon: ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }[];
}> = ({ actions }) => {
  return (
    <div className="flex items-center space-x-2">
      {actions.map(({ icon, onClick, disabled }, index) => {
        return (
          <Button
            key={`tools-action-${index}`}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            disabled={disabled}
            variant="outline"
            size="icon"
          >
            {icon}
          </Button>
        );
      })}
    </div>
  );
};
