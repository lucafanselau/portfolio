import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { isNone, preventProps } from "@components/utils";
import { tools } from "@content/tools";
import { IconInfoCircle } from "@tabler/icons-react";
import { Button } from "@ui/button";
import { FC, ReactNode } from "react";

export const ToolsToolbar: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <div className="absolute inset-x-0 z-50 bottom-4">
      <div className="relative w-full">
        <div className="card p-2 flex justify-between items-center pointer-events-auto">
          {children}
        </div>
      </div>
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
