import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { isNone } from "@components/utils";
import { tools } from "@content/tools";
import type { ToolsContent as ToolsContentType } from "@content/tools/types";
import { Slot } from "@radix-ui/react-slot";
import { LoadingAnimation } from "@ui/loader";
import { H1, P } from "@ui/typography";

export const ToolsContent = () => {
  const panel = useStore(...selectors.content);
  if (isNone(panel)) return null;

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <div
          id="content-icon"
          className="border-2 basis-16 grow-0 shrink-0 h-16 border-muted-foreground rounded-md flex items-center justify-center"
        >
          <Slot className="w-12 h-12 text-muted-foreground">{panel.icon}</Slot>
        </div>
        <div className="flex flex-col justify-center items-start">
          <H1 className="max-w-[300px]">{panel.header[0]}</H1>
          <P color="lighter" size="xs">
            {panel.header[1]}
          </P>
        </div>
      </div>
      {panel.body}
    </div>
  );
};
