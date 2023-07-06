import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { Button } from "@ui/button";
import { cn } from "@ui/utils";
import { FC, ReactNode } from "react";

export const ToolsToolbar: FC<{ children?: ReactNode }> = ({ children }) => {
  const open = useStore(...selectors.ui.open.slide);

  return (
    <div
      className={cn(
        "relative w-full basis-auto flex flex-col justify-end",
        open && "flex-1 min-h-0"
      )}
    >
      <div className="card p-0 pointer-events-auto max-h-full">{children}</div>
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
      {actions.map(({ icon, onClick, disabled }) => {
        return (
          <Button
            key={`tools-action-${icon}`}
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
