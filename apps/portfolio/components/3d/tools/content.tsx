import { useRetained } from "@components/hooks/use-retained";
import { isNone } from "@components/utils";
import type { ToolsContent } from "@content/tools/types";
import { Slot } from "@radix-ui/react-slot";
import { H1, P } from "@ui/typography";
import type { FC } from "react";

export const ToolsPanelContent: FC<{ panel: ToolsContent }> = ({ panel }) => {
  const retained = useRetained(panel);
  if (isNone(retained)) return null;
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <div
          id="content-icon"
          className="flex h-16 shrink-0 grow-0 basis-16 items-center justify-center rounded-md border-2 border-muted-foreground"
        >
          <Slot className="h-12 w-12 text-muted-foreground">
            {retained.icon}
          </Slot>
        </div>
        <div className="flex flex-col items-start justify-center">
          <H1 className="max-w-[300px]">{retained.header[0]}</H1>
          <P color="lighter" size="xs">
            {retained.header[1]}
          </P>
        </div>
      </div>
      {retained.body}
    </div>
  );
};
