import { transitionToCamera } from "@3d/camera";
import { useStore } from "@3d/store";
import { AsyncButton } from "@ui/async-button";
import { Button } from "@ui/button";
import { P } from "@ui/typography";
import { ComponentType, Fragment } from "react";
import { match } from "ts-pattern";

export type ProgressComponent = ComponentType<{
  onProgress: (value: "explore" | "build") => Promise<void>;
}>;

const Start: ProgressComponent = ({ onProgress }) => {
  return (
    <AsyncButton size="sm" onAsyncClick={() => onProgress("explore")}>
      Let's Start
    </AsyncButton>
  );
};

const Explore: ProgressComponent = ({ onProgress }) => {
  const history = useStore((s) => s.world.interactionHistory);
  const total = Object.keys(history).length;
  const numOfChecked = Object.values(history)
    .map(Number)
    .reduce((a, b) => a + b, 0);

  return (
    <Fragment>
      <P color="lighter" size="2xs" className="text-right max-w-[36ch]">
        {numOfChecked === total ? (
          <>
            Great you have finished the quest. Now let's expand the city a bit!
          </>
        ) : (
          <>
            You are still <b>missing {total - numOfChecked} locations</b>. Look
            for the <b>School, Office and House</b>
          </>
        )}
      </P>
      <AsyncButton
        size="sm"
        onAsyncClick={() => onProgress("build")}
        className={"px-8 pointer-events-auto"}
        disabled={total !== numOfChecked}
      >
        Next
      </AsyncButton>
    </Fragment>
  );
};

export const ToolsProgress = () => {
  const state = useStore((s) => s.state);

  const onProgress = async (value: "explore" | "build") => {
    const { setState } = useStore.getState();
    await transitionToCamera(value, "guy");
    setState(value);
  };

  return match(state)
    .with("start", () => <Start onProgress={onProgress} />)
    .with("explore", () => <Explore onProgress={onProgress} />)
    .otherwise(() => null);
};
