import { useStore } from "@3d/store";
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

export const InfoButton = () => {
  return (
    <Button
      onClick={() =>
        useStore.getState().updateTools({ type: "slide", key: "info" })
      }
      variant="ghost"
      size="icon"
    >
      <IconInfoCircle />
    </Button>
  );
};
