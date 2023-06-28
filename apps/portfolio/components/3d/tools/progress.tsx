import { useStore } from "@3d/store";
import { Button } from "@ui/button";
import { match } from "ts-pattern";

const Start = () => {
  return <Button size="sm">Let's Start</Button>;
};

const Explore = () => {};

export const ToolsProgress = () => {
  const state = useStore((s) => s.state);

  return match(state)
    .with("start", () => <Start />)
    .with("explore", () => <Explore />)
    .otherwise(() => null);
};
