import { useStore } from "@3d/store";
import type { State } from "@3d/store/store";
import { formatters } from "@components/formatters";
import { isSome } from "@components/utils";
import { AsyncButton } from "@ui/async-button";
import { P } from "@ui/typography";
import type { FC } from "react";
import { useCallback } from "react";
export type ProgressItem = {
  target: State;
  button: string;
  disabled?: boolean;
  extraText?: string;
};

export const ToolsProgress: FC<{ item: ProgressItem }> = ({ item }) => {
  const onClick = useCallback(async () => {
    if (isSome(item)) await useStore.getState().updateState(item.target);
  }, [item.target]);

  return (
    <div className="flex flex-1 items-center justify-end space-x-2">
      {isSome(item.extraText) && (
        <P color="lighter" size="2xs" className="max-w-[36ch] text-right">
          {formatters.bold(item.extraText)}
        </P>
      )}
      <AsyncButton
        size="sm"
        onAsyncClick={onClick}
        className={"pointer-events-auto px-8"}
        disabled={item.disabled}
      >
        {item.button}
      </AsyncButton>
    </div>
  );
};
