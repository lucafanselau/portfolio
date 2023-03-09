import { CharacterState, useStore } from "@3d/store";
import { RootState, useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { FC, PropsWithChildren, useEffect, useRef } from "react";
import { Group, Vector3 } from "three";
import { match, P } from "ts-pattern";
import { constants } from "./constants";
import { ActionName, Model as Guy } from "./guy";

const actionLookup: Record<CharacterState["state"], ActionName> = {
  idle: "Idle",
  "long-idle": "Wave",
  interact: "Interact_standing",
  run: "Run",
  walk: "Walk",
};

const last = new Vector3();
const vector = new Vector3();
const characterStateMachine = (
  { clock }: RootState,
  delta: number
): CharacterState => {
  const {
    character,
    slots: { guy },
    target,
  } = useStore.getState();
  if (!guy) return { state: "long-idle" };

  return match<CharacterState, CharacterState>(character)
    .with({ state: "idle" }, ({ start }) => {
      if (clock.getElapsedTime() > start + 2) return { state: "long-idle" };
      return { state: "idle", start };
    })
    .with({ state: P.union("walk", "run") }, ({}) => {
      // move towards target and record velocity during that
      last.copy(guy.position);
      easing.damp3(guy.position, target, 1, delta, 10);
      const vel = last.sub(guy.position).length() / delta;
      const distance = vector.copy(target).sub(guy.position).length();
      // Kick start movement when position changed
      if (distance < constants.eps)
        return { state: "idle", start: clock.getElapsedTime() };

      // also update the rotation
      const direction = last.copy(guy.position).sub(target);
      const angle = Math.atan2(direction.x, direction.z);
      easing.dampAngle(guy.rotation, "y", angle, 1, delta, 10);

      // switch into different mode depending on velocity
      if (vel > 4) return { state: "run" };
      else return { state: "walk" };
    })
    .with({ state: "interact" }, (state) => state)
    .with({ state: "long-idle" }, (state) => state)
    .exhaustive();
};

export const Person: FC<PropsWithChildren<{}>> = ({ children }) => {
  const setSlot = useStore((state) => state.setSlot);
  const model = useRef<Group>(null);

  // frame - to - frame logic
  useFrame((args, delta) =>
    useStore.getState().setCharacterState(characterStateMachine(args, delta))
  );

  // discrete events
  // handle new targets
  useEffect(
    () =>
      useStore.subscribe(
        (s) => s.target,
        () => useStore.getState().setCharacterState({ state: "walk" }),
        {
          equalityFn: (a, b) => a.equals(b),
        }
      ),
    []
  );

  const action = useStore((s) => actionLookup[s.character.state]);

  return (
    <>
      <group ref={(g) => setSlot("guy", g)}>
        <Guy fade={0.2} action={action} ref={model} />
        {children}
      </group>
    </>
  );
};
