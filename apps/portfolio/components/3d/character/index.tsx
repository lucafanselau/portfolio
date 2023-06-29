import { useStore } from "@3d/store";
import { RootState, useFrame } from "@react-three/fiber";
import { easing, misc } from "maath";
import { FC, PropsWithChildren, useEffect, useRef } from "react";
import { Group, Vector3 } from "three";
import { match, P } from "ts-pattern";
import { constants } from "@3d/constants";
import { ActionName, Model as Guy } from "./model";
import { isNone } from "@components/utils";
import { CharacterState } from "@3d/store/store";

const actionLookup: Record<CharacterState["state"], ActionName> = {
  greet: "Wave",
  idle: "Idle",
  /* interact: "Interact_standing", */
  run: "Run",
  rotate: "Walk",
  walk: "Walk",
};

const last = new Vector3();
const vector = new Vector3();

const characterStateMachine = (
  { camera }: RootState,
  guy: Group,
  model: Group,
  delta: number
): CharacterState["state"] => {
  const { character, target } = useStore.getState();

  return match<CharacterState, CharacterState["state"]>(character)
    .with({ state: "idle" }, ({}) => {
      // rotate to face camera
      const direction = guy
        .getWorldPosition(last)
        .sub(camera.getWorldPosition(vector))
        .multiplyScalar(-1);
      const angle = Math.atan2(direction.x, direction.z);
      easing.dampAngle(model.rotation, "y", angle, 0.2, delta, 40);

      /* const deltaAngle = misc.deltaAngle(model.rotation.y, angle); */
      return "idle";
    })
    .with({ state: "rotate" }, () => {
      // also update the rotation
      const direction = last.copy(guy.position).sub(target).multiplyScalar(-1);
      const angle = Math.atan2(direction.x, direction.z);
      easing.dampAngle(model.rotation, "y", angle, 0.5, delta, 40);

      const deltaAngle = misc.deltaAngle(model.rotation.y, angle);
      return Math.abs(deltaAngle) < constants.threshold.angle
        ? "walk"
        : "rotate";
    })
    .with({ state: P.union("walk", "run") }, ({}) => {
      // move towards target and record velocity during that
      last.copy(guy.position);
      easing.damp3(guy.position, target, 1, delta, 10);
      const vel = last.sub(guy.position).length() / delta;
      const distance = vector.copy(target).sub(guy.position).length();
      // Kick start movement when position changed
      if (distance < constants.threshold.position) return "idle";
      // switch into different mode depending on velocity
      if (vel > 4) return "run";
      else return "walk";
    })
    .with({ state: "greet" }, (state) => state.state)
    .exhaustive();
};

export const AnimatedCharacter: FC<PropsWithChildren<{}>> = ({ children }) => {
  const model = useRef<Group>(null);
  const guy = useRef<Group>(null);

  // frame - to - frame logic
  useFrame((args, delta) => {
    if (isNone(model.current) || isNone(guy.current)) return;
    useStore
      .getState()
      .updateCharacter(
        characterStateMachine(args, guy.current, model.current, delta)
      );
    useStore.getState().updatePosition(guy.current.position);
  });

  const action = useStore((s) => actionLookup[s.character.state]);

  return (
    <group ref={guy}>
      <Guy
        ref={model}
        scale={0.6}
        fade={0.2}
        action={action}
        rotation={[0, -Math.PI / 2, 0]}
      />
      {children}
    </group>
  );
};
