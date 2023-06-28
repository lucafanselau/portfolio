import { useStore } from "@3d/store";
import { isNone } from "@components/utils";
import { tools } from "@content/tools";
import type { ToolsContent as ToolsContentType } from "@content/tools/types";
import { LoadingAnimation } from "@ui/loader";
import { H1, P } from "@ui/typography";

export const ToolsContent = () => {
  const state = useStore((s) => s.state);
  const subpart = useStore((s) => s.ui.subpart);

  // @ts-expect-error Not all keys are valid in all of the content objects, we check this though before rendering anything
  const panel: ToolsContentType = tools[state]?.[subpart];

  if (isNone(panel)) return <LoadingAnimation />;

  return (
    <div className="flex flex-col space-y-2">
      <H1>{panel.header[0]}</H1>
      <P color="lighter">{panel.header[1]}</P>
      {panel.body}
    </div>
  );
};
