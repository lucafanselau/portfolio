import { cn } from "@ui/utils";
import { IconBulldozer, IconCrane, IconHammer } from "@tabler/icons-react";
import { ButtonGroup } from "@ui/button-group";
import { AppearCard } from "@ui/card";
import { FC, useState } from "react";
import { P } from "@ui/typography";
import { Build } from "./build";
import { Destroy } from "./destroy";
import { ToolsState, useToolsStore } from "./store";
import { match } from "ts-pattern";
import { Button } from "@ui/button";

const content = cn("absolute bottom-[56px] left-0 w-full");

type ToolMode = "build" | "destroy";
function capitalize(string: string) {
  return string[0].toUpperCase() + string.slice(1);
}

const ActiveTool: FC<{ state: ToolsState }> = ({ state }) => {
  const toolName = match(state)
    .with({ type: "build" }, ({ mode }) => (
      <>
        <IconHammer className={"inline mr-2"} /> {capitalize(mode)}
      </>
    ))

    .with({ type: "destroy" }, () => "Destroy")
    .run();

  const end = useToolsStore((state) => state.end);

  // TODO: do a more creative design (using tailwind)
  return (
    <div className={"card flex space-x-2 justify-between items-center"}>
      <P>Active Tool:</P>
      <P className={"flex items-center"}>{toolName}</P>
      <Button variant={"destructive"} onClick={end}>
        Cancel
      </Button>
    </div>
  );
};

export const BuildingTools = () => {
  const [mode, setMode] = useState<ToolMode | null>(null);
  const state = useToolsStore((state) => state.state);
  const startDestroy = useToolsStore((state) => state.startDestroy);

  const handleClick = (newMode: string) =>
    setMode((old) => {
      if (old == newMode) return null;
      return newMode as ToolMode;
    });

  return (
    <div className={"absolute bottom-4 left-4 right-4"}>
      {state === undefined ? (
        <>
          <ButtonGroup.List value={mode} onValueChange={handleClick}>
            <ButtonGroup.Trigger value="build">
              <IconCrane />
            </ButtonGroup.Trigger>
            <ButtonGroup.Trigger onClick={startDestroy} value="destroy">
              <IconBulldozer />
            </ButtonGroup.Trigger>
          </ButtonGroup.List>
          <AppearCard open={mode !== null} className={content}>
            {mode === "build" && <Build />}
            {/* {mode === "destroy" && <Destroy />} */}
          </AppearCard>
        </>
      ) : (
        <ActiveTool state={state} />
      )}
    </div>
  );
};
