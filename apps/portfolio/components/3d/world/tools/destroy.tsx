import { P } from "@ui/typography";
import { useEffect } from "react";
import { useToolsStore } from "./store";

// react function component that returns a text about destryozing buildings in the world and updates the useToolsStore on mount

// to state: { type: "destroy"}
export const Destroy = () => {
  const startDestroy = useToolsStore((state) => state.startDestroy);
  const end = useToolsStore((state) => state.end);
  useEffect(() => {
    startDestroy();
    return end;
  }, [startDestroy, end]);
  return <P>Destroying buildings in the world</P>;
};
