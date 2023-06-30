import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { isNone, preventProps } from "@components/utils";
import { tools } from "@content/tools";
import { IconInfoCircle } from "@tabler/icons-react";
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

export const ToolsActionButtons: FC<{}> = ({}) => {
  const actions = useStore(...selectors.ui.actions);

  if (isNone(actions)) return null;
  return (
    <div className="flex items-center space-x-2">
      {actions.map(([action, icon]) => {
        return (
          <Button
            key={`tools-action-${action}`}
            onClick={(e) => {
              e.stopPropagation();
              useStore.getState().updateTools({ type: "slide", key: action });
            }}
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
