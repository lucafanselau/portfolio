import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { Button } from "@ui/button";
import { cn } from "@ui/utils";
import { FC, ReactNode } from "react";

export const ToolsToolbar: FC<{ children?: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const open = useStore(...selectors.ui.open.slide);

  return (
    <div
      className={cn(
        "relative w-full min-h-0 basis-auto flex flex-col justify-end"
        // open && "flex-1 min-h-0"
      )}
    >
      <div className={cn("card p-0 pointer-events-auto max-h-full", className)}>
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
