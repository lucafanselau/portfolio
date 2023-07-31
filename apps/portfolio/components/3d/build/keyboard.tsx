import { useStore } from "@3d/store";
import {
  KeyboardControls,
  KeyboardControlsEntry,
  useKeyboardControls,
} from "@react-three/drei";
import { FC, ReactNode, useEffect } from "react";
import { mutation } from "./mutation";

export type BuildControls =
  // | "forward"
  // | "backward"
  // | "left"
  // | "right"
  "rotateCCW" | "rotateCW" | "build" | "cancel";

const map: KeyboardControlsEntry<BuildControls>[] = [
  // { name: "forward", keys: ["ArrowUp", "KeyW"] },
  // { name: "backward", keys: ["ArrowDown", "KeyS"] },
  // { name: "left", keys: ["ArrowLeft", "KeyA"] },
  // { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "rotateCCW", keys: ["KeyQ"] },
  { name: "rotateCW", keys: ["KeyE"] },
  { name: "build", keys: ["Enter"] },
  { name: "cancel", keys: ["Escape"] },
];

export const useBuildKeyboard = useKeyboardControls<BuildControls>;

const BuildKeyboardDispatcher = () => {
  const [sub, _] = useBuildKeyboard();

  useEffect(() => {
    const unsubscribes = map.map(({ name }) => {
      return sub(
        (state) => state[name],
        (state) => {
          if (state) {
            console.log(name);
            switch (name) {
              case "rotateCCW":
                return mutation.events.other.rotate("CCW");
              case "rotateCW":
                return mutation.events.other.rotate("CW");
              case "build":
                return mutation.build();
              case "cancel":
                return useStore.getState().updateTools({ type: "dismiss" });
            }
          }
        }
      );
    });
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [sub]);

  return null;
};

export const BuildKeyboard: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <KeyboardControls map={map}>
      <BuildKeyboardDispatcher />
      {children}
    </KeyboardControls>
  );
};
