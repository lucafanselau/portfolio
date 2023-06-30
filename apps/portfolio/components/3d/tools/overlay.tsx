import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { cn } from "@ui/utils";
import { ReactNode, useCallback } from "react";
import { FC } from "react";

export const ToolsOverlay: FC<{ children?: ReactNode }> = ({ children }) => {
  const opaque = useStore(...selectors.ui.opaque);
  const dismissable = useStore(...selectors.ui.dismissable);

  const onClick = useCallback(
    () => useStore.getState().updateTools({ type: "dismiss" }),
    []
  );

  return (
    <div
      className={cn(
        "absolute inset-0",
        opaque && "bg-background/20 backdrop-blur-sm",
        dismissable ? "pointer-events-auto" : "pointer-events-none"
      )}
      onClick={dismissable ? onClick : undefined}
    >
      {children}
    </div>
  );
};
