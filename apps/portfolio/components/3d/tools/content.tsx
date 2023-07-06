import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { useRetained } from "@components/hooks/use-retained";
import { isNone } from "@components/utils";
import type { ToolsContent } from "@content/tools/types";
import { Slot } from "@radix-ui/react-slot";
import { H1, P } from "@ui/typography";
import { FC } from "react";

export const ToolsPanelContent: FC<{ panel: ToolsContent }> = ({ panel }) => {
  const retained = useRetained(panel);
  if (isNone(retained)) return null;
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <div
          id="content-icon"
          className="border-2 basis-16 grow-0 shrink-0 h-16 border-muted-foreground rounded-md flex items-center justify-center"
        >
          <Slot className="w-12 h-12 text-muted-foreground">
            {retained.icon}
          </Slot>
        </div>
        <div className="flex flex-col justify-center items-start">
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
