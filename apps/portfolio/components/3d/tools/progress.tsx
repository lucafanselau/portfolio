import { useStore } from "@3d/store";
import { selectors } from "@3d/store/selector";
import { State } from "@3d/store/store";
import { formatters } from "@components/formatters";
import { isNone, isSome } from "@components/utils";
import { AsyncButton } from "@ui/async-button";
import { P } from "@ui/typography";
import { useCallback } from "react";
export type ProgressItem = {
  target: State;
  button: string;
  disabled?: boolean;
  extraText?: string;
};

export const ToolsProgress = () => {
  const item = useStore(...selectors.progress);
  const onClick = useCallback(async () => {
    if (isSome(item)) await useStore.getState().updateState(item.target);
  }, [item?.target]);

  if (isNone(item)) return null;

  return (
    <div className="flex-1 flex justify-end items-center space-x-2">
      {isSome(item.extraText) && (
        <P color="lighter" size="2xs" className="text-right max-w-[36ch]">
          {formatters.bold(item.extraText)}
        </P>
      )}
      <AsyncButton
        size="sm"
        onAsyncClick={onClick}
        className={"px-8 pointer-events-auto"}
        disabled={item.disabled}
      >
        {item.button}
      </AsyncButton>
    </div>
  );
};
