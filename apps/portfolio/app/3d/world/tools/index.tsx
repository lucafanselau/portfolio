import { cn } from "@/utils";
import { IconBulldozer, IconCrane } from "@tabler/icons-react";
import { ButtonGroup } from "@ui/button-group";
import { AppearCard } from "@ui/card";
import { useState } from "react";
import { P } from "@ui/typography";
import { Build } from "./build";
import { Destroy } from "./destroy";

const content = cn("absolute bottom-[56px] left-0 w-full");

type ToolMode = "build" | "destroy";

export const BuildingTools = () => {
  const [mode, setMode] = useState<ToolMode | null>(null);

  const handleClick = (newMode: string) =>
    setMode((old) => {
      if (old == newMode) return null;
      return newMode as ToolMode;
    });

  return (
    <div className={"absolute bottom-4 left-4 right-4"}>
      <ButtonGroup.List value={mode} onValueChange={handleClick}>
        <ButtonGroup.Trigger value="build">
          <IconCrane />
        </ButtonGroup.Trigger>
        <ButtonGroup.Trigger value="destroy">
          <IconBulldozer />
        </ButtonGroup.Trigger>
      </ButtonGroup.List>
      <AppearCard open={mode !== null} className={content}>
        {mode === "build" && <Build />}
        {mode === "destroy" && <Destroy />}
      </AppearCard>
    </div>
  );
};
