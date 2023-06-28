import { transitionToCamera } from "@3d/camera";
import { useStore } from "@3d/store";
import { preventProps } from "@3d/story/explore";
import { Button } from "@ui/button";
import { P } from "@ui/typography";
import { FC } from "react";

const TopLevelButton = () => {
  const onClick = async () => {
    const { setState } = useStore.getState();
    await transitionToCamera("build", "origin");
    setState("build");
  };

  const history = useStore((s) => s.world.interactionHistory);
  const total = Object.keys(history).length;
  const numOfChecked = Object.values(history)
    .map(Number)

    .reduce((a, b) => a + b, 0);

  return (
    <>
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
      <Button
        {...preventProps}
        onClick={onClick}
        className={"px-8 pointer-events-auto"}
        disabled={total !== numOfChecked}
      >
        Next
      </Button>
    </>
  );
};

export const StateProgress: FC = () => {
  return (
    <div className="ml-2 flex space-x-2 items-center">
      <TopLevelButton />
    </div>
  );
};
