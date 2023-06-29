import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { isNone } from "@components/utils";
import { tools } from "@content/tools";
import type { ToolsContent as ToolsContentType } from "@content/tools/types";
import { LoadingAnimation } from "@ui/loader";
import { H1, P } from "@ui/typography";

export const ToolsContent = () => {
  const panel = useStore(...selectors.content);
  if (isNone(panel)) return <LoadingAnimation />;

  return (
    <div className="flex flex-col space-y-2">
      <H1>{panel.header[0]}</H1>
      <P color="lighter">{panel.header[1]}</P>
      {panel.body}
    </div>
  );
};
